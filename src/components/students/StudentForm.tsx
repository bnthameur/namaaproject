import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createStudent, updateStudent, getTeachers } from '@/utils/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  name: z.string().min(2, { message: 'يجب إدخال اسم الطالب' }),
  phone: z.string().min(10, { message: 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل' }),
  age: z.coerce.number().min(3, { message: 'العمر يجب أن يكون 3 سنوات على الأقل' }).max(18, { message: 'العمر يجب أن يكون 18 سنة أو أقل' }),
  category: z.string({
    required_error: 'يرجى اختيار فئة الطالب',
  }),
  subscription_fee: z.coerce.number().min(1000, { message: 'قيمة الاشتراك يجب أن تكون 1000 د.ج على الأقل' }),
  subscription_type: z.string().default('monthly'),
  subscription_start_date: z.date().optional(),
  subscription_end_date: z.date().optional(),
  sessions_remaining: z.coerce.number().optional(),
  teacher_id: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  student?: any;
}

const StudentForm: React.FC<StudentFormProps> = ({ isOpen, onClose, student }) => {
  const isEditing = !!student;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers
  });

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      phone: student?.phone || '',
      age: student?.age || 6,
      category: student?.category || 'learning_difficulties',
      subscription_fee: student?.subscription_fee || 4000,
      subscription_type: student?.subscription_type || 'monthly',
      subscription_start_date: student?.subscription_start_date ? new Date(student.subscription_start_date) : undefined,
      subscription_end_date: student?.subscription_end_date ? new Date(student.subscription_end_date) : undefined,
      sessions_remaining: student?.sessions_remaining || 0,
      teacher_id: student?.teacher_id || '',
      notes: student?.notes || '',
      active: student?.active !== undefined ? student.active : true,
    },
  });

  const subscriptionType = form.watch('subscription_type');

  const studentMutation = useMutation({
    mutationFn: (data: StudentFormValues) => {
      if (isEditing) {
        return updateStudent(student.id, data);
      } else {
        return createStudent(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-subscriptions'] });
      toast({
        title: isEditing ? 'تم التعديل' : 'تمت الإضافة',
        description: isEditing 
          ? 'تم تعديل بيانات الطالب بنجاح' 
          : 'تمت إضافة الطالب بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.',
        variant: 'destructive',
      });
      console.error('Save error:', error);
    },
  });

  const onSubmit = (data: StudentFormValues) => {
    studentMutation.mutate(data);
  };

  const categoryOptions = [
    { value: 'autism', label: 'التوحد' },
    { value: 'learning_difficulties', label: 'صعوبات التعلم' },
    { value: 'memory_issues', label: 'مشاكل الذاكرة' },
    { value: 'medical_conditions', label: 'حالات طبية' },
    { value: 'preparatory', label: 'الفصل التحضيري' },
  ];

  const subscriptionTypeOptions = [
    { value: 'monthly', label: 'شهري' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'per_session', label: 'بالجلسة' },
    { value: 'course', label: 'دورة تدريبية' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl scrollable-dialog-content">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطالب</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل اسم الطالب" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم هاتف ولي الأمر</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="رقم الهاتف" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العمر</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="3" max="18" />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر فئة الطالب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subscription_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قيمة الاشتراك</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input {...field} type="number" min="1000" className="w-full" />
                        <span className="mr-2">د.ج</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscription_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الاشتراك</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الاشتراك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subscriptionTypeOptions.map((option) => (
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
            </div>

            {subscriptionType !== 'per_session' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscription_start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ بداية الاشتراك</FormLabel>
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
                                format(field.value, "PPP", { locale: ar })
                              ) : (
                                <span>اختر تاريخاً</span>
                              )}
                              <Calendar className="mr-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscription_end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ انتهاء الاشتراك</FormLabel>
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
                                format(field.value, "PPP", { locale: ar })
                              ) : (
                                <span>اختر تاريخاً</span>
                              )}
                              <Calendar className="mr-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {subscriptionType === 'per_session' && (
              <FormField
                control={form.control}
                name="sessions_remaining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الجلسات المتبقية</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المعلمة المسؤولة</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المعلمة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-teacher">بدون معلمة</SelectItem>
                      {teachers.map((teacher) => (
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

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">حالة الطالب</FormLabel>
                    <FormDescription>
                      هل الطالب نشط حالياً؟
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    <Textarea
                      placeholder="أي ملاحظات إضافية حول الطالب"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={studentMutation.isPending}
              >
                {studentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : null}
                {isEditing ? 'حفظ التعديلات' : 'إضافة الطالب'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
