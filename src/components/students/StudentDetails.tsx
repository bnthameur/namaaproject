import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getStudentById, getStudentTransactions, createTransaction } from '@/utils/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, User, Calendar, Phone, GraduationCap, PiggyBank, Info, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'يجب إدخال قيمة المبلغ' }),
  description: z.string().min(2, { message: 'يرجى إدخال وصف للمعاملة' }),
});

interface StudentDetailsProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const categoryTranslation: Record<string, string> = {
  'autism': 'التوحد',
  'learning_difficulties': 'صعوبات التعلم',
  'memory_issues': 'مشاكل الذاكرة',
  'medical_conditions': 'حالات طبية',
  'preparatory': 'الفصل التحضيري'
};

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      description: 'اشتراك شهري',
    },
  });

  const { data: student, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['student-transactions', studentId],
    queryFn: () => getStudentTransactions(studentId),
    enabled: !!studentId,
  });

  const createPaymentMutation = useMutation({
    mutationFn: (data: z.infer<typeof paymentSchema>) => {
      const paymentData = {
        type: 'income',
        category: 'subscription',
        amount: data.amount,
        description: data.description,
        date: new Date(),
        student_id: studentId
      };
      return createTransaction(paymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-transactions', studentId] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'تمت الإضافة',
        description: 'تمت إضافة المدفوعات بنجاح',
      });
      setShowPaymentForm(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المدفوعات. حاول مرة أخرى.',
        variant: 'destructive',
      });
      console.error('Payment error:', error);
    },
  });

  const onSubmitPayment = (data: z.infer<typeof paymentSchema>) => {
    createPaymentMutation.mutate(data);
  };

  const totalPayments = transactions.reduce((sum, transaction) => {
    if (transaction.type === 'income') {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);

  if (isLoadingStudent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-3xl">
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>معلومات الطالب</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {student?.name?.[0] || 'S'}
              </AvatarFallback>
            </Avatar>
            <span className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              student?.active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {student?.active ? 'نشط' : 'غير نشط'}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <h2 className="text-xl font-bold">{student?.name}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{student?.phone || 'غير متوفر'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">العمر: {student?.age} سنوات</span>
            </div>
            
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">الفئة: {categoryTranslation[student?.category] || student?.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">قيمة الاشتراك: {student?.subscription_fee?.toLocaleString() || 0} د.ج</span>
            </div>

            {student?.notes && (
              <div className="flex items-start gap-2 mt-2">
                <Info className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-gray-700">{student.notes}</span>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="payments">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>معلومات المعلمة</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                <span>المدفوعات</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المعلمة</CardTitle>
              </CardHeader>
              <CardContent>
                {student?.teachers ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.teachers.name?.[0] || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{student.teachers.name}</h3>
                        <p className="text-sm text-gray-500">المعلمة المسؤولة</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>لم يتم تعيين معلمة لهذا الطالب بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>سجل المدفوعات</CardTitle>
                  <CardDescription>إجمالي المدفوعات: {totalPayments.toLocaleString()} د.ج</CardDescription>
                </div>
                <Button onClick={() => setShowPaymentForm(!showPaymentForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة دفعة
                </Button>
              </CardHeader>
              <CardContent>
                {showPaymentForm && (
                  <div className="mb-6 border rounded-md p-4 bg-slate-50">
                    <h3 className="text-lg font-medium mb-4">إضافة دفعة جديدة</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitPayment)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المبلغ</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input {...field} type="number" className="w-full" />
                                  <span className="mr-2">د.ج</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الوصف</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="وصف المدفوعات"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowPaymentForm(false)}
                          >
                            إلغاء
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createPaymentMutation.isPending}
                          >
                            {createPaymentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            ) : null}
                            حفظ المدفوعات
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {isLoadingTransactions ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>الوصف</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {format(new Date(transaction.date), 'PPP', { locale: ar })}
                          </TableCell>
                          <TableCell>
                            <span className={transaction.type === 'income' 
                              ? 'text-green-600' 
                              : 'text-red-600'}>
                              {transaction.type === 'income' ? 'دخل' : 'مصروف'}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.amount?.toLocaleString() || 0} د.ج</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <PiggyBank className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>لا توجد مدفوعات مسجلة لهذا الطالب</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetails;
