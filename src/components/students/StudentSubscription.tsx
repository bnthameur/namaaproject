
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renewStudentSubscription, calculateSubscriptionStatus } from '@/utils/supabase';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, RefreshCw, Calendar, CreditCard, Loader2 } from 'lucide-react';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';

const renewalSchema = z.object({
  amount: z.coerce.number().min(1000, { message: 'المبلغ يجب أن يكون 1000 د.ج على الأقل' })
});

type RenewalFormValues = z.infer<typeof renewalSchema>;

interface StudentSubscriptionProps {
  student: any;
}

const StudentSubscription: React.FC<StudentSubscriptionProps> = ({ student }) => {
  const [showRenewalForm, setShowRenewalForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<RenewalFormValues>({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      amount: student?.subscription_fee || 0
    }
  });
  
  const renewalMutation = useMutation({
    mutationFn: (data: RenewalFormValues) => {
      return renewStudentSubscription(student.id, data.amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', student.id] });
      queryClient.invalidateQueries({ queryKey: ['student-transactions', student.id] });
      queryClient.invalidateQueries({ queryKey: ['expiring-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast({
        title: 'تم التجديد',
        description: 'تم تجديد اشتراك الطالب بنجاح'
      });
      
      setShowRenewalForm(false);
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تجديد الاشتراك. حاول مرة أخرى.',
        variant: 'destructive'
      });
      console.error('Renewal error:', error);
    }
  });
  
  const onSubmitRenewal = (data: RenewalFormValues) => {
    renewalMutation.mutate(data);
  };
  
  if (!student) return null;
  
  const subscriptionStatus = calculateSubscriptionStatus(student);
  
  const getSubscriptionTypeLabel = (type: string) => {
    switch(type) {
      case 'monthly': return 'شهري';
      case 'weekly': return 'أسبوعي';
      case 'per_session': return 'بالجلسة';
      case 'course': return 'دورة تدريبية';
      default: return type;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>معلومات الاشتراك</span>
        </CardTitle>
        <Button 
          variant="outline"
          className="gap-1"
          onClick={() => setShowRenewalForm(!showRenewalForm)}
        >
          <RefreshCw className="h-4 w-4" />
          <span>تجديد الاشتراك</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-3 rounded-md border p-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">نوع الاشتراك:</span>
            <span className="font-medium">{getSubscriptionTypeLabel(student.subscription_type || 'monthly')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">قيمة الاشتراك:</span>
            <span className="font-medium">{student.subscription_fee?.toLocaleString() || 0} د.ج</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">حالة الاشتراك:</span>
            <SubscriptionStatusBadge 
              status={subscriptionStatus} 
              type={student.subscription_type}
              daysRemaining={student.subscription_end_date ? 
                Math.ceil((new Date(student.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
                undefined
              }
              sessionsRemaining={student.sessions_remaining}
            />
          </div>
          
          {student.subscription_type !== 'per_session' && (
            <>
              {student.subscription_start_date && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">تاريخ البداية:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {format(new Date(student.subscription_start_date), 'PPP', { locale: ar })}
                  </span>
                </div>
              )}
              
              {student.subscription_end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {format(new Date(student.subscription_end_date), 'PPP', { locale: ar })}
                  </span>
                </div>
              )}
            </>
          )}
          
          {student.subscription_type === 'per_session' && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الجلسات المتبقية:</span>
              <span className="font-medium">{student.sessions_remaining || 0} جلسة</span>
            </div>
          )}
          
          {student.last_payment_date && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">آخر دفعة:</span>
              <span className="font-medium flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                {format(new Date(student.last_payment_date), 'PPP', { locale: ar })}
              </span>
            </div>
          )}
        </div>
        
        {showRenewalForm && (
          <div className="border rounded-md p-4 bg-slate-50">
            <h3 className="text-lg font-medium mb-4">تجديد الاشتراك</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRenewal)} className="space-y-4">
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
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRenewalForm(false)}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={renewalMutation.isPending}
                  >
                    {renewalMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    ) : null}
                    تجديد الاشتراك
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSubscription;
