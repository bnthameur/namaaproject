
import React from 'react';
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import BlurCard from '@/components/ui/BlurCard';
import { Progress } from '@/components/ui/progress';

const FinanceSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlurCard className="relative overflow-hidden">
        <div className="absolute right-2 top-2 bg-green-50 text-green-600 rounded-full p-2">
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
        <p className="text-3xl font-bold mt-2">$125,400</p>
        <div className="flex items-center mt-2">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">+8.2% from last month</span>
        </div>
      </BlurCard>
      
      <BlurCard className="relative overflow-hidden">
        <div className="absolute right-2 top-2 bg-red-50 text-red-600 rounded-full p-2">
          <ArrowDownRight className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
        <p className="text-3xl font-bold mt-2">$97,850</p>
        <div className="flex items-center mt-2">
          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-sm text-red-600">+12.4% from last month</span>
        </div>
      </BlurCard>
      
      <BlurCard className="relative overflow-hidden">
        <h3 className="text-sm font-medium text-muted-foreground">Budget Utilization</h3>
        <p className="text-3xl font-bold mt-2">78%</p>
        <Progress value={78} className="h-2 mt-4" />
        <p className="text-sm text-muted-foreground mt-2">$97,850 of $125,000 budget</p>
      </BlurCard>
    </div>
  );
};

export default FinanceSummary;
