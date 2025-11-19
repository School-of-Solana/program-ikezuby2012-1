use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{ self, Mint, TokenAccount, TokenInterface, TransferChecked };
use crate::state::*;
use crate::error::ErrorCode;


pub fn process_repay(ctx: Context<Repay>, amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user_account;

    let borrowed_asset = user.borrowed_sol; 

    if amount > borrowed_asset {
        return Err(ErrorCode::OverRepay.into());
    }

    let transfer_cpi_accounts = TransferChecked {
        from: ctx.accounts.user_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.reserve_token_account.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, transfer_cpi_accounts);
    let decimals = ctx.accounts.mint.decimals;

    token_interface::transfer_checked(cpi_ctx, amount, decimals)?;

    let reserve = &mut ctx.accounts.reserve;

    let borrowed_ratio = amount.checked_div(reserve.total_borrowed).unwrap();
    let users_shares = reserve.total_borrowed_shares.checked_mul(borrowed_ratio).unwrap();
    
    let user = &mut ctx.accounts.user_account;
    user.borrowed_sol -= amount;
    user.borrowed_sol_shares -= users_shares; 
    reserve.total_borrowed -= amount;
    reserve.total_borrowed_shares -= users_shares;

    Ok(())
}

#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut, 
        seeds = [mint.key().as_ref()],
        bump,
    )]  
    pub reserve: Account<'info, Reserve>,
    #[account(
        mut, 
        seeds = [b"reserve", mint.key().as_ref()],
        bump, 
    )]  
    pub reserve_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut, 
        seeds = [signer.key().as_ref()],
        bump,
    )]  
    pub user_account: Account<'info, User>,
    #[account( 
        init_if_needed, 
        payer = signer,
        associated_token::mint = mint, 
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>, 
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
