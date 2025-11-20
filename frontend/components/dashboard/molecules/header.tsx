"use client";

import { WalletButton } from '@/components/solana/solana-provider';
import { useWallet } from '@solana/wallet-adapter-react'

const Header = () => {
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };
    const { publicKey, connected } = useWallet();

    return (
        <header className="dark:text-white fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">$</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text dark:text-white">
                        Lendiwy
                    </h1>
                </div>
                {connected && publicKey ? formatAddress(publicKey.toString()) : <WalletButton />}
            </div>
        </header>
    );
};

export default Header;
