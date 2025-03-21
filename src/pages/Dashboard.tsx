
import React from 'react';
import FinanceSummary from '@/components/dashboard/FinanceSummary';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BlurCard from '@/components/ui/BlurCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const monthlyData = [
  { name: 'Jan', income: 24000, expense: 18000 },
  { name: 'Feb', income: 26000, expense: 17000 },
  { name: 'Mar', income: 25000, expense: 20000 },
  { name: 'Apr', income: 27000, expense: 19000 },
  { name: 'May', income: 29000, expense: 21000 },
  { name: 'Jun', income: 28000, expense: 22000 },
  { name: 'Jul', income: 30000, expense: 23000 },
  { name: 'Aug', income: 31000, expense: 24000 },
  { name: 'Sep', income: 32000, expense: 25000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <FinanceSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <BlurCard className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={80} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, undefined]}
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
                />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BlurCard>
        
        <BlurCard>
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="text-sm font-medium text-blue-700">Total Students</div>
              <div className="text-2xl font-bold">248</div>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="text-sm font-medium text-purple-700">Total Staff</div>
              <div className="text-2xl font-bold">36</div>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="text-sm font-medium text-amber-700">Classes</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-sm font-medium text-emerald-700">Average Attendance</div>
              <div className="text-2xl font-bold">92%</div>
            </div>
          </div>
        </BlurCard>
      </div>
      
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
