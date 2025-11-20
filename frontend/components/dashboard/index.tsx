"use client";

import Header from "./molecules/header";
import InteractionPanel from "./molecules/InteractionPanel";
import MarketOverview from "./molecules/MarketOverview";
import { useWallet } from '@solana/wallet-adapter-react'

export default function Dashboard() {
    const { connected } = useWallet();

    const marketData: MarketData = {
        tvl: "$5,234,890",
        totalSupplied: "$4,123,456",
        totalBorrowed: "$2,891,234",
        utilizationRate: 70.1,
    };

    const apyRates: APYRates = {
        supplyAPY: 4.5,
        borrowAPY: 8.2,
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-background font-sans dark:text-white dark:bg-black">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        Solana Lending Protocol
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Supply assets, earn yield, and borrow against your collateral with competitive rates
                    </p>
                </div>

                <MarketOverview marketData={marketData} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InteractionPanel
                        isConnected={connected}
                        apyRates={apyRates}
                    />
                    {/* <UserPosition 
            isConnected={isConnected}
            position={userPosition}
          /> */}
                </div>

                <div className="text-center text-sm text-muted-foreground pt-8">
                    <p>Built on Solana • Powered by lendiwy</p>
                </div>
            </main>
        </div>
    );
}
