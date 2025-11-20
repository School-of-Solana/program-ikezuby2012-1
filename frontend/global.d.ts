interface MarketData {
  tvl: string;
  totalSupplied: string;
  totalBorrowed: string;
  utilizationRate: number;
}

interface UserPosition {
  suppliedSOL: number;
  borrowedUSDC: number;
  healthFactor: number;
  ltv: number;
}

interface APYRates {
  supplyAPY: number;
  borrowAPY: number;
}
