
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createTeacher, updateTeacher } from '@/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const teacherSchema = z.object({
  name: z.string().min(2, { message: 'يجب إدخال اسم المعلمة' }),
  phone: z.string().min(10, { message: 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل' }),
  percentage: z.coerce.number().min(1, { message: 'يجب إدخال نسبة مئوية' }).max(100, { message: 'النسبة المئوية لا يمكن أن تتجاوز 100%' }),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: any;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ isOpen, onClose, teacher }) => {
  const isEditing = !!teacher;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: teacher?.name || '',
      phone: teacher?.phone || '',
      percentage: teacher?.percentage || 60,
      notes: teacher?.notes || '',
      active: teacher?.active !== undefined ? teacher.active : true,
    },
  });

  const teacherMutation = useMutation({
    mutationFn: (data: z.infer<typeof teacherSchema>) => {
      if (isEditing) {
        return updateTeacher(teacher.id, data);
      } else {
        return createTeacher(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: isEditing ? 'تم التعديل' : 'تمت الإضافة',
        description: isEditing 
          ? 'تم تعديل بيانات المعلمة بنجاح' 
          : 'تمت إضافة المعلمة بنجاح',
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

  const onSubmit = (data: z.infer<typeof teacherSchema>) => {
    teacherMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل بيانات المعلمة' : 'إضافة معلمة جديدة'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المعلمة</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل اسم المعلمة" />
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
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="رقم الهاتف" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النسبة المئوية من اشتراكات الطلاب</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input {...field} type="number" min="1" max="100" className="w-24" />
                      <span className="mr-2">%</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    النسبة المئوية التي تحصل عليها المعلمة من اشتراكات الطلاب
                  </FormDescription>
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
                    <FormLabel className="text-base">حالة المعلمة</FormLabel>
                    <FormDescription>
                      هل المعلمة نشطة ومتاحة للتدريس حالياً؟
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
                      placeholder="أي ملاحظات إضافية حول المعلمة"
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
                disabled={teacherMutation.isPending}
              >
                {teacherMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : null}
                {isEditing ? 'حفظ التعديلات' : 'إضافة المعلمة'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherForm;
