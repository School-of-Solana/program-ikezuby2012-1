use std::f32::consts::E;

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{ self, Mint, TokenAccount, TokenInterface, TransferChecked };
use pyth_solana_receiver_sdk::price_update::{get_feed_id_from_hex, PriceUpdateV2};
use crate::constants::{MAXIMUM_AGE, SOL_USD_FEED_ID};
use crate::state::*;
use crate::error::ErrorCode;

pub fn process_borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
    let reserve = &mut ctx.accounts.reserve;
    let user = &mut ctx.accounts.user_account;

    let price_update = &mut ctx.accounts.price_update;

    let total_collateral: u64;

    let sol_feed_id = get_feed_id_from_hex(SOL_USD_FEED_ID)?; 
    let sol_price = price_update.get_price_no_older_than(&Clock::get()?, MAXIMUM_AGE, &sol_feed_id)?;
    let accrued_interest = calculate_accrued_interest(user.deposited_sol, reserve.interest_rate, user.last_updated)?;
    total_collateral = sol_price.price as u64 * (user.deposited_sol + accrued_interest);

    let borrowable_amount = total_collateral as u64 *  reserve.liquidation_threshold;

    if borrowable_amount < amount {
        return Err(ErrorCode::OverBorrowableAmount.into());
    }       

    let transfer_cpi_accounts = TransferChecked {
        from: ctx.accounts.reserve_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.reserve_token_account.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let mint_key = ctx.accounts.mint.key();
    let signer_seeds: &[&[&[u8]]] = &[
        &[
            b"reserve",
            mint_key.as_ref(),
            &[ctx.bumps.reserve_token_account],
        ],
    ];
    let cpi_ctx = CpiContext::new(cpi_program, transfer_cpi_accounts).with_signer(signer_seeds);
    let decimals = ctx.accounts.mint.decimals;

    token_interface::transfer_checked(cpi_ctx, amount, decimals)?;

    if reserve.total_borrowed == 0 {
        reserve.total_borrowed = amount;
        reserve.total_borrowed_shares = amount;
    } 

    let borrow_ratio = amount.checked_div(reserve.total_borrowed).unwrap();
    let users_shares = reserve.total_borrowed_shares.checked_mul(borrow_ratio).unwrap();

    reserve.total_borrowed += amount;
    reserve.total_borrowed_shares += users_shares; 

    user.borrowed_sol += amount;
    user.deposited_sol_shares += users_shares;

    Ok(())
}

fn calculate_accrued_interest(deposited: u64, interest_rate: u64, last_update: i64) -> Result<u64> {
    let current_time = Clock::get()?.unix_timestamp;
    let time_elapsed = current_time - last_update;
    let new_value = (deposited as f64 * E.powf(interest_rate as f32 * time_elapsed as f32) as f64) as u64;
    Ok(new_value)
}

#[derive(Accounts)]
pub struct Borrow<'info> {
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
    pub price_update: Account<'info, PriceUpdateV2>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}