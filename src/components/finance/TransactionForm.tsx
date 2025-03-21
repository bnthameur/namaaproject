
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('يجب أن يكون المبلغ إيجابياً'),
  description: z.string().min(3, 'يجب أن يكون الوصف 3 أحرف على الأقل'),
  category: z.string(),
  date: z.date(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'income',
      amount: undefined,
      description: '',
      category: '',
      date: new Date(),
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    toast.success('تمت إضافة المعاملة بنجاح', {
      description: `${data.type === 'income' ? 'دخل' : 'مصروف'}: ${data.amount} د.ج لـ${data.description}`,
    });
    
    form.reset();
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
                    <Input type="number" placeholder="0.00" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="subscription">اشتراك طالب</SelectItem>
                    <SelectItem value="teacher">مستحقات المعلمات</SelectItem>
                    <SelectItem value="ads">إعلانات فيسبوك</SelectItem>
                    <SelectItem value="utilities">فواتير ومرافق</SelectItem>
                    <SelectItem value="taxes">ضرائب</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
