
import React, { useState } from 'react';
import { Calendar, DollarSign, Download, Filter, Plus } from 'lucide-react';
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
    ? ['Staff Salary', 'Supplies', 'Maintenance', 'Utilities', 'Equipment'][i % 5] 
    : ['Tuition Fee', 'Library Fee', 'Bus Fee', 'Examination Fee', 'Admission Fee'][i % 5],
  amount: i % 3 === 0 
    ? Math.floor(Math.random() * 5000) + 500 
    : Math.floor(Math.random() * 2000) + 200,
  category: i % 3 === 0 
    ? ['Salary', 'Supplies', 'Maintenance', 'Utilities', 'Equipment'][i % 5] 
    : ['Tuition', 'Library', 'Transport', 'Examination', 'Admission'][i % 5],
  date: new Date(2023, 8, 30 - i),
  paymentMethod: ['Cash', 'Bank Transfer', 'Check', 'Credit Card'][i % 4],
  status: ['Completed', 'Pending', 'Completed', 'Completed'][i % 4],
}));

const Finance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (searchTerm === '' || transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === null || transaction.type === filterType)
    );
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Finance Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search transactions..."
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
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('income')}>
                  Income Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('expense')}>
                  Expenses Only
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
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{format(transaction.date, 'MMM dd, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed' 
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
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                          <span>{format(transaction.date, 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        +${transaction.amount}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Completed' 
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
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                          <span>{format(transaction.date, 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        -${transaction.amount}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Completed' 
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
