
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { getExpiringSubscriptions } from '@/utils/supabase';
import { Loader2, AlarmClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ExpiringSubscriptionsProps {
  onViewStudent?: (studentId: string) => void;
  daysThreshold?: number;
}

const ExpiringSubscriptions: React.FC<ExpiringSubscriptionsProps> = ({ 
  onViewStudent, 
  daysThreshold = 7 
}) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['expiring-subscriptions', daysThreshold],
    queryFn: () => getExpiringSubscriptions(daysThreshold),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-amber-500" />
            <span>اشتراكات على وشك الانتهاء</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-amber-500" />
            <span>اشتراكات على وشك الانتهاء</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>لا توجد اشتراكات على وشك الانتهاء</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === 'expired') {
      return <Badge variant="destructive">منتهي</Badge>;
    } else if (status === 'warning') {
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">على وشك الانتهاء</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">نشط</Badge>;
    }
  };

  const getSubscriptionType = (type: string) => {
    switch(type) {
      case 'monthly': return 'شهري';
      case 'weekly': return 'أسبوعي';
      case 'per_session': return 'بالجلسة';
      case 'course': return 'دورة';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-amber-500" />
          <span>اشتراكات على وشك الانتهاء</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>نوع الاشتراك</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{getSubscriptionType(student.subscription_type)}</TableCell>
                <TableCell>{student.subscription_fee.toLocaleString()} د.ج</TableCell>
                <TableCell>
                  {student.subscription_type === 'per_session' 
                    ? `${student.sessions_remaining} جلسات`
                    : `${student.days_remaining} يوم`
                  }
                </TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell className="text-left">
                  {onViewStudent && (
                    <Button variant="ghost" size="sm" onClick={() => onViewStudent(student.id)}>
                      عرض
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpiringSubscriptions;
