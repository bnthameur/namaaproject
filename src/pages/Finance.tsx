
import React, { useState } from 'react';
import { Calendar, Download, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';
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

// Sample data
const transactions = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? 'expense' : 'income',
  description: i % 3 === 0 
    ? ['مستحقات المعلمات', 'مستلزمات', 'صيانة', 'فواتير', 'إعلانات فيسبوك'][i % 5] 
    : ['اشتراك طالب', 'رسوم تسجيل', 'اشتراك خاص', 'اشتراك شهري', 'دفعة مقدمة'][i % 5],
  amount: i % 3 === 0 
    ? Math.floor(Math.random() * 10000) + 1000 
    : Math.floor(Math.random() * 5000) + 1000,
  category: i % 3 === 0 
    ? ['مستحقات', 'مستلزمات', 'صيانة', 'فواتير', 'إعلانات'][i % 5] 
    : ['اشتراك', 'رسوم', 'اشتراك خاص', 'اشتراك شهري', 'مقدم'][i % 5],
  date: new Date(2023, 8, 30 - i),
  paymentMethod: ['نقداً', 'تحويل بنكي', 'شيك', 'بريد'][i % 4],
  status: ['مكتمل', 'قيد الانتظار', 'مكتمل', 'مكتمل'][i % 4],
}));

const Finance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (searchTerm === '' || transaction.description.includes(searchTerm)) &&
      (filterType === null || transaction.type === filterType)
    );
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة المالية</h1>
        
        <Dialog>
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
            <TransactionForm />
          </DialogContent>
        </Dialog>
      </div>
      
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
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.id}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'income' ? 'دخل' : 'مصروف'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{format(transaction.date, 'dd MMM yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount} د.ج
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'مكتمل' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
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
                {filteredTransactions
                  .filter(t => t.type === 'income')
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">#{transaction.id}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{format(transaction.date, 'dd MMM yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        +{transaction.amount} د.ج
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'مكتمل' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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
                {filteredTransactions
                  .filter(t => t.type === 'expense')
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">#{transaction.id}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{format(transaction.date, 'dd MMM yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        -{transaction.amount} د.ج
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'مكتمل' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
