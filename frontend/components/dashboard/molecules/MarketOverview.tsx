import { ArrowUpRight, TrendingUp, Wallet, Activity } from "lucide-react";
import { Card } from "@/components/atoms/Card";


interface MarketOverviewProps {
  marketData: MarketData;
}

const MarketOverview = ({ marketData }: MarketOverviewProps) => {
  const metrics = [
    {
      label: "Total Value Locked",
      value: marketData.tvl,
      icon: Wallet,
      trend: "+12.3%",
    },
    {
      label: "Total Supplied",
      value: marketData.totalSupplied,
      icon: ArrowUpRight,
      trend: "+8.5%",
    },
    {
      label: "Total Borrowed",
      value: marketData.totalBorrowed,
      icon: TrendingUp,
      trend: "+15.2%",
    },
    {
      label: "Utilization Rate",
      value: `${marketData.utilizationRate.toFixed(1)}%`,
      icon: Activity,
      trend: "+2.1%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className="p-6 bg-gradient-to-br from-card to-secondary border-border hover:border-accent/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-success font-medium">{metric.trend}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default MarketOverview;
