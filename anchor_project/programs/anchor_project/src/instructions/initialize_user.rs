use crate::state::*;

use anchor_lang::prelude::*;

pub fn process_init_user(ctx: Context<InitUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;
    user.owner = ctx.accounts.signer.key();
    
    let now = Clock::get()?.unix_timestamp; 
    user.last_updated = now;

    Ok(())
}

#[derive(Accounts)]
pub struct InitUser<'info> {
#[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer, 
        space = 8 + User::INIT_SPACE,
        seeds = [signer.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, User>,
    pub system_program: Program <'info, System>,
}