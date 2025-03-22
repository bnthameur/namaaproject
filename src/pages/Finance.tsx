
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Plus, PiggyBank, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import BlurCard from '@/components/ui/BlurCard';
import TransactionForm from '@/components/finance/TransactionForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions, getMonthlyFinancialSummary } from '@/utils/supabase';
import { Loader2 } from 'lucide-react';

const categoryTranslations: Record<string, string> = {
  'subscription': 'اشتراك',
  'teacher_payout': 'دفع للمعلمة',
  'ads': 'إعلانات',
  'utilities': 'خدمات',
  'taxes': 'ضرائب',
  'other': 'أخرى'
};

const Finance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  
  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financial-summary', currentYear, currentMonth],
    queryFn: () => getMonthlyFinancialSummary(currentYear, currentMonth),
  });
  
  const handleTransactionAdded = () => {
    refetch();
    setIsDialogOpen(false);
  };
  
  const filteredTransactions = transactions.filter((transaction: any) => {
    const matchesSearch = searchTerm === '' || 
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.students?.name && transaction.students.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.teachers?.name && transaction.teachers.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === null || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const renderTransactionsList = (transactions: any[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
            لا توجد معاملات مالية متطابقة مع البحث
          </TableCell>
        </TableRow>
      );
    }

    return transactions.map((transaction: any) => (
      <TableRow key={transaction.id}>
        <TableCell className="font-medium">#{transaction.id.slice(0, 6)}</TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            transaction.type === 'income' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {transaction.type === 'income' ? 'دخل' : 'مصروف'}
          </span>
        </TableCell>
        <TableCell>
          {transaction.description}
          {transaction.students?.name && (
            <div className="text-xs text-muted-foreground mt-1">
              الطالب: {transaction.students.name}
            </div>
          )}
          {transaction.teachers?.name && (
            <div className="text-xs text-muted-foreground mt-1">
              المعلمة: {transaction.teachers.name}
            </div>
          )}
        </TableCell>
        <TableCell>{categoryTranslations[transaction.category] || transaction.category}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{transaction.date ? format(new Date(transaction.date), 'PPP', { locale: ar }) : 'N/A'}</span>
          </div>
        </TableCell>
        <TableCell className={`font-medium ${
          transaction.type === 'income' 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}{transaction.amount?.toLocaleString()} د.ج
        </TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
            مكتمل
          </span>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة المالية</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>إضافة معاملة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة معاملة جديدة</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={handleTransactionAdded} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Monthly Financial Summary */}
      {isLoadingSummary ? (
        <div className="flex justify-center items-center p-6 mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : financialSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>الدخل الشهري</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialSummary.summary.totalIncome.toLocaleString()} د.ج
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {format(financialSummary.period.startDate, 'MMMM yyyy', { locale: ar })}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>المصاريف الشهرية</span>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialSummary.summary.totalExpenses.toLocaleString()} د.ج
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {format(financialSummary.period.startDate, 'MMMM yyyy', { locale: ar })}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>صافي الربح</span>
                <PiggyBank className="h-5 w-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialSummary.summary.netProfit.toLocaleString()} د.ج
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {format(financialSummary.period.startDate, 'MMMM yyyy', { locale: ar })}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">كل المعاملات</TabsTrigger>
            <TabsTrigger value="income">الدخل</TabsTrigger>
            <TabsTrigger value="expense">المصاريف</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="بحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  كل الأنواع
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('income')}>
                  الدخل فقط
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('expense')}>
                  المصاريف فقط
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all">
          <BlurCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTransactionsList(filteredTransactions)}
              </TableBody>
            </Table>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="income">
          <BlurCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTransactionsList(filteredTransactions.filter((t: any) => t.type === 'income'))}
              </TableBody>
            </Table>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="expense">
          <BlurCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTransactionsList(filteredTransactions.filter((t: any) => t.type === 'expense'))}
              </TableBody>
            </Table>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
