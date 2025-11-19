#![allow(unexpected_cfgs)]

use crate::instructions::*;
use anchor_lang::prelude::*;

mod state;
mod instructions;
mod error;
mod constants;

declare_id!("3MxfQL7yUhhEhypAHbDSPQG5AEPx15YHt18rScFW3VHM");

#[program]
pub mod anchor_project {
    use super::*;

    pub fn init_reserve(ctx: Context<InitReserve>, liquidation_threshold: u64, max_ltv: u64) -> Result<()> {
        process_init_reserve(ctx, liquidation_threshold, max_ltv)
    }

    pub fn init_user(ctx: Context<InitUser>) -> Result<()> {
        process_init_user(ctx)
    }

    pub fn deposit (ctx: Context<Deposit>, amount: u64) -> Result<()> {
        process_deposit(ctx, amount)
    }

    pub fn withdraw (ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        process_withdraw(ctx, amount)
    }

    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        process_borrow(ctx, amount)
    }

    pub fn repay(ctx: Context<Repay>, amount: u64) -> Result<()> {
        process_repay(ctx, amount)
    }
}
