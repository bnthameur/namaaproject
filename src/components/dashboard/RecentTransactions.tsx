
import React from 'react';
import { Calendar, DollarSign, GraduationCap, PenLine, Printer, Receipt, UserPlus } from 'lucide-react';
import BlurCard from '@/components/ui/BlurCard';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const transactions = [
  {
    id: 1,
    type: 'income',
    description: 'Tuition fee payment',
    amount: 1250,
    student: 'Emma Thompson',
    date: new Date('2023-09-28'),
    icon: GraduationCap,
  },
  {
    id: 2,
    type: 'expense',
    description: 'Staff salary payment',
    amount: 3400,
    student: null,
    date: new Date('2023-09-27'),
    icon: UserPlus,
  },
  {
    id: 3,
    type: 'income',
    description: 'Library fee payment',
    amount: 50,
    student: 'James Wilson',
    date: new Date('2023-09-26'),
    icon: GraduationCap,
  },
  {
    id: 4,
    type: 'expense',
    description: 'Stationery supplies',
    amount: 350,
    student: null,
    date: new Date('2023-09-25'),
    icon: PenLine,
  },
  {
    id: 5,
    type: 'expense',
    description: 'Printer maintenance',
    amount: 120,
    student: null,
    date: new Date('2023-09-24'),
    icon: Printer,
  }
];

const RecentTransactions: React.FC = () => {
  return (
    <BlurCard className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          <span>View All</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <transaction.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {transaction.student && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {transaction.student}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className={`font-medium ${
              transaction.type === 'income' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </BlurCard>
  );
};

export default RecentTransactions;
