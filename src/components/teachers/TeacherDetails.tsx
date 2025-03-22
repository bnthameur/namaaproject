
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTeacherById, getTeacherStudents, getTeacherTransactions, createTransaction } from '@/utils/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, User, Calendar, Phone, Users, PiggyBank, Info, BookText, Plus, AlertCircle } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'يجب إدخال قيمة المبلغ' }),
  description: z.string().min(2, { message: 'يرجى إدخال وصف للمعاملة' }),
});

interface TeacherDetailsProps {
  teacherId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ teacherId, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      description: 'دفع مستحقات',
    },
  });

  // Fetch teacher data
  const { data: teacher, isLoading: isLoadingTeacher } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: () => getTeacherById(teacherId),
    enabled: !!teacherId,
  });

  // Fetch teacher's students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['teacher-students', teacherId],
    queryFn: () => getTeacherStudents(teacherId),
    enabled: !!teacherId,
  });

  // Fetch teacher's transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['teacher-transactions', teacherId],
    queryFn: () => getTeacherTransactions(teacherId),
    enabled: !!teacherId,
  });

  // Process the amounts to calculate current earnings and payments
  const totalStudentsIncome = students.reduce((sum, student) => {
    if (student.active && student.subscription_fee) {
      return sum + (student.subscription_fee * (teacher?.percentage || 0) / 100);
    }
    return sum;
  }, 0);

  // Calculate total payments made to the teacher
  const totalPaymentsToTeacher = transactions.reduce((sum, transaction) => {
    if (transaction.type === 'expense') {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);

  // Calculate what the teacher is currently owed
  const currentlyOwed = totalStudentsIncome - totalPaymentsToTeacher;

  // Function to handle payment to teacher
  const createPaymentMutation = useMutation({
    mutationFn: (data: z.infer<typeof paymentSchema>) => {
      const paymentData = {
        type: 'expense',
        category: 'teacher_payout',
        amount: data.amount,
        description: data.description,
        date: new Date(),
        teacher_id: teacherId
      };
      return createTransaction(paymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-transactions', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
        description: 'حدث خطأ أثناء دفع المستحقات. حاول مرة أخرى.',
        variant: 'destructive',
      });
      console.error('Payment error:', error);
    },
  });

  const onSubmitPayment = (data: z.infer<typeof paymentSchema>) => {
    createPaymentMutation.mutate(data);
  };

  if (isLoadingTeacher) {
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
          <DialogTitle>معلومات المعلمة</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {teacher?.name?.[0] || 'M'}
              </AvatarFallback>
            </Avatar>
            <span className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              teacher?.active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {teacher?.active ? 'نشطة' : 'غير نشطة'}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <h2 className="text-xl font-bold">{teacher?.name}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{teacher?.phone || 'غير متوفر'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">نسبة الاشتراك: {teacher?.percentage || 0}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                {teacher?.created_at 
                  ? `تاريخ الانضمام: ${format(new Date(teacher.created_at), 'PPP', { locale: ar })}`
                  : 'تاريخ الانضمام غير متوفر'
                }
              </span>
            </div>

            {teacher?.notes && (
              <div className="flex items-start gap-2 mt-2">
                <Info className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-gray-700">{teacher.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time payment tracking card */}
        <Card className="mb-4 bg-gray-50">
          <CardHeader>
            <CardTitle>المستحقات المالية</CardTitle>
            <CardDescription>
              المستحقات الحالية للمعلمة بناءً على الطلاب النشطين
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>إجمالي المستحقات:</span>
                <span className="font-bold text-lg">{totalStudentsIncome.toLocaleString()} د.ج</span>
              </div>
              <div className="flex justify-between items-center">
                <span>تم دفع:</span>
                <span className="font-bold text-lg text-green-600">{totalPaymentsToTeacher.toLocaleString()} د.ج</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span>المستحق حالياً:</span>
                <span className="font-bold text-lg text-blue-600">{currentlyOwed.toLocaleString()} د.ج</span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>نسبة الدفع</span>
                  <span>{totalStudentsIncome > 0 ? Math.round((totalPaymentsToTeacher / totalStudentsIncome) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={totalStudentsIncome > 0 ? (totalPaymentsToTeacher / totalStudentsIncome) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => {
                  setShowPaymentForm(!showPaymentForm);
                  form.setValue('amount', currentlyOwed);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  دفع المستحقات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showPaymentForm && (
          <div className="mb-6 border rounded-md p-4 bg-slate-50">
            <h3 className="text-lg font-medium mb-4">دفع مستحقات للمعلمة</h3>
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

        <Tabs defaultValue="students">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>الطلاب</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                <span>سجل المدفوعات</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>قائمة طلاب المعلمة</CardTitle>
                <CardDescription>عدد الطلاب: {students.length}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStudents ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>العمر</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>قيمة الاشتراك</TableHead>
                        <TableHead>المستحق للمعلمة</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.age} سنوات</TableCell>
                          <TableCell>{student.category}</TableCell>
                          <TableCell>{student.subscription_fee?.toLocaleString() || 0} د.ج</TableCell>
                          <TableCell>
                            {Math.round(student.subscription_fee * (teacher?.percentage || 0) / 100).toLocaleString()} د.ج
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              student.active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {student.active ? 'نشط' : 'غير نشط'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <BookText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>لا يوجد طلاب مسجلين مع هذه المعلمة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل المدفوعات</CardTitle>
                <CardDescription>إجمالي المدفوعات: {totalPaymentsToTeacher.toLocaleString()} د.ج</CardDescription>
              </CardHeader>
              <CardContent>
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
                    <p>لا توجد مدفوعات مسجلة لهذه المعلمة</p>
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

export default TeacherDetails;
