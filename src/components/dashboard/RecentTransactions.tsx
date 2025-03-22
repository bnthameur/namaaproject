
import React from 'react';
import { Calendar, GraduationCap, BookOpen, Wifi, PenLine, Receipt } from 'lucide-react';
import BlurCard from '@/components/ui/BlurCard';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/utils/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Get only the 5 most recent transactions
  const transactions = allTransactions.slice(0, 5);

  // Map transaction categories to icons
  const getCategoryIcon = (category: string, type: string) => {
    if (type === 'income') return GraduationCap;
    
    switch (category) {
      case 'teacher_payout':
        return BookOpen;
      case 'ads':
        return PenLine;
      case 'utilities':
        return Wifi;
      default:
        return Receipt;
    }
  };

  const handleViewAll = () => {
    navigate('/finance');
  };

  if (isLoading) {
    return (
      <BlurCard className="mt-6">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BlurCard>
    );
  }

  return (
    <BlurCard className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">المعاملات الأخيرة</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleViewAll}>
          <Receipt className="h-4 w-4" />
          <span>عرض الكل</span>
        </Button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          <Receipt className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>لا توجد معاملات حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction: any) => {
            const Icon = getCategoryIcon(transaction.category, transaction.type);
            return (
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
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {transaction.students && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {transaction.students.name}
                        </span>
                      )}
                      {transaction.teachers && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {transaction.teachers.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(transaction.date), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount?.toLocaleString() || 0} د.ج
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BlurCard>
  );
};

export default RecentTransactions;
