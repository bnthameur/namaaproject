import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BlurCard from '@/components/ui/BlurCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createTransaction, getStudents, getTeachers } from '@/utils/supabase';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('يجب أن يكون المبلغ إيجابياً'),
  description: z.string().min(3, 'يجب أن يكون الوصف 3 أحرف على الأقل'),
  category: z.string(),
  date: z.date(),
  notes: z.string().optional(),
  student_id: z.string().optional(),
  teacher_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm: React.FC = () => {
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    enabled: typeof window !== 'undefined',
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
    enabled: typeof window !== 'undefined',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'income',
      amount: undefined,
      description: '',
      category: '',
      date: new Date(),
      notes: '',
      student_id: undefined,
      teacher_id: undefined,
    },
  });

  const transactionType = form.watch('type');
  const selectedCategory = form.watch('category');

  const onSubmit = async (data: FormValues) => {
    try {
      await createTransaction(data);
      
      toast.success('تمت إضافة المعاملة بنجاح', {
        description: `${data.type === 'income' ? 'دخل' : 'مصروف'}: ${data.amount} د.ج لـ${data.description}`,
      });
      
      form.reset({
        type: 'income',
        amount: undefined,
        description: '',
        category: '',
        date: new Date(),
        notes: '',
        student_id: undefined,
        teacher_id: undefined,
      });
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('حدث خطأ أثناء إضافة المعاملة', {
        description: 'الرجاء المحاولة مرة أخرى أو الاتصال بمسؤول النظام.',
      });
    }
  };

  const getCategoryOptions = () => {
    if (transactionType === 'income') {
      return [
        { value: 'subscription', label: 'اشتراك طالب' }
      ];
    } else {
      return [
        { value: 'teacher_payout', label: 'مستحقات المعلمات' },
        { value: 'ads', label: 'إعلانات فيسبوك' },
        { value: 'utilities', label: 'فواتير ومرافق' },
        { value: 'taxes', label: 'ضرائب' },
        { value: 'other', label: 'أخرى' }
      ];
    }
  };

  return (
    <BlurCard>
      <h2 className="text-xl font-semibold mb-4">إضافة معاملة جديدة</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع المعاملة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المعاملة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">دخل</SelectItem>
                    <SelectItem value="expense">مصروف</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المبلغ (د.ج)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>التاريخ</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>اختر تاريخاً</span>
                          )}
                          <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Input placeholder="وصف المعاملة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getCategoryOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {transactionType === 'income' && selectedCategory === 'subscription' && (
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الطالب</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "select-student"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الطالب" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="select-student" disabled>اختر الطالب</SelectItem>
                      {students?.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {transactionType === 'expense' && selectedCategory === 'teacher_payout' && (
            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المعلمة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "select-teacher"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المعلمة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="select-teacher" disabled>اختر المعلمة</SelectItem>
                      {teachers?.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ملاحظات</FormLabel>
                <FormControl>
                  <Textarea placeholder="ملاحظات إضافية (اختياري)" {...field} />
                </FormControl>
                <FormDescription>
                  أي معلومات إضافية عن هذه المعاملة.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit">إضافة المعاملة</Button>
          </div>
        </form>
      </Form>
    </BlurCard>
  );
};

export default TransactionForm;
