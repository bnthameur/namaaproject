
import React from 'react';
import { Calendar, DollarSign, GraduationCap, PenLine, Receipt, BookOpen, Wifi } from 'lucide-react';
import BlurCard from '@/components/ui/BlurCard';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const transactions = [
  {
    id: 1,
    type: 'income',
    description: 'اشتراك طالب',
    amount: 4000,
    student: 'أمينة بلقاسم',
    date: new Date('2023-09-28'),
    icon: GraduationCap,
  },
  {
    id: 2,
    type: 'expense',
    description: 'مستحقات المعلمة',
    amount: 12600,
    student: null,
    date: new Date('2023-09-27'),
    icon: BookOpen,
  },
  {
    id: 3,
    type: 'income',
    description: 'اشتراك طالب',
    amount: 5000,
    student: 'ياسين مرزوقي',
    date: new Date('2023-09-26'),
    icon: GraduationCap,
  },
  {
    id: 4,
    type: 'expense',
    description: 'إعلانات فيسبوك',
    amount: 3500,
    student: null,
    date: new Date('2023-09-25'),
    icon: PenLine,
  },
  {
    id: 5,
    type: 'expense',
    description: 'فاتورة الإنترنت',
    amount: 1200,
    student: null,
    date: new Date('2023-09-24'),
    icon: Wifi,
  }
];

const RecentTransactions: React.FC = () => {
  return (
    <BlurCard className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">المعاملات الأخيرة</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          <span>عرض الكل</span>
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
                    {format(transaction.date, 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className={`font-medium ${
              transaction.type === 'income' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount} د.ج
            </div>
          </div>
        ))}
      </div>
    </BlurCard>
  );
};

export default RecentTransactions;
