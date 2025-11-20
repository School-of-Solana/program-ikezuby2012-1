"use client";

import { useState } from "react";
import { Card } from "@/components/atoms/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/Label";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "react-hot-toast";

interface InteractionPanelProps {
  isConnected: boolean;
  apyRates: APYRates;
}

const InteractionPanel = ({ isConnected, apyRates }: InteractionPanelProps) => {
  const [supplyAmount, setSupplyAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");

  const handleSupply = () => {
    if (!supplyAmount || parseFloat(supplyAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Supplied ${supplyAmount} SOL successfully!`);
    setSupplyAmount("");
  };

  const handleBorrow = () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Borrowed ${borrowAmount} USDC successfully!`);
    setBorrowAmount("");
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border">
      <Tabs defaultValue="supply" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="supply" className="gap-2">
            <ArrowDown className="h-4 w-4" />
            Supply
          </TabsTrigger>
          <TabsTrigger value="borrow" className="gap-2">
            <ArrowUp className="h-4 w-4" />
            Borrow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supply" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="supply-amount">Amount (SOL)</Label>
              <div className="text-sm text-muted-foreground">
                Balance: <span className="text-foreground font-medium">0.00</span>
              </div>
            </div>
            <div className="relative">
              <Input
                id="supply-amount"
                type="number"
                placeholder="0.0"
                value={supplyAmount}
                onChange={(e) => setSupplyAmount(e.target.value)}
                className="pr-16 h-14 text-lg"
                disabled={!isConnected}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">SOL</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Supply APY</span>
              <span className="text-lg font-bold text-success">{apyRates.supplyAPY}%</span>
            </div>
          </div>

          <Button
            onClick={handleSupply}
            disabled={!isConnected}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isConnected ? "Supply SOL" : "Connect Wallet to Supply"}
          </Button>
        </TabsContent>

        <TabsContent value="borrow" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="borrow-amount">Amount (USDC)</Label>
              <div className="text-sm text-muted-foreground">
                Available: <span className="text-foreground font-medium">0.00</span>
              </div>
            </div>
            <div className="relative">
              <Input
                id="borrow-amount"
                type="number"
                placeholder="0.0"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="pr-20 h-14 text-lg"
                disabled={!isConnected}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">USDC</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Borrow APY</span>
              <span className="text-lg font-bold text-destructive">{apyRates.borrowAPY}%</span>
            </div>
          </div>

          <Button
            onClick={handleBorrow}
            disabled={!isConnected}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
            variant="secondary"
          >
            {isConnected ? "Borrow USDC" : "Connect Wallet to Borrow"}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InteractionPanel;
