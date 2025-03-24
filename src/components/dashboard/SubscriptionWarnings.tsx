
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/utils/supabase';
import { CircleAlert, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SubscriptionWarnings = () => {
  const navigate = useNavigate();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
  
  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>حالة الاشتراكات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { subscriptionStats, expiringSubscriptions } = stats;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>حالة الاشتراكات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center rounded-lg border p-3 bg-green-50">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-lg font-bold">{subscriptionStats.active || 0}</span>
            <span className="text-sm text-gray-500">نشط</span>
          </div>
          
          <div className="flex flex-col items-center rounded-lg border p-3 bg-amber-50">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <span className="text-lg font-bold">{subscriptionStats.warning || 0}</span>
            <span className="text-sm text-gray-500">على وشك الانتهاء</span>
          </div>
          
          <div className="flex flex-col items-center rounded-lg border p-3 bg-red-50">
            <CircleAlert className="h-8 w-8 text-red-500 mb-2" />
            <span className="text-lg font-bold">{subscriptionStats.expired || 0}</span>
            <span className="text-sm text-gray-500">منتهي</span>
          </div>
        </div>
        
        {expiringSubscriptions && expiringSubscriptions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-amber-500 flex items-center gap-1 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>اشتراكات تنتهي قريباً</span>
            </h3>
            
            <ul className="space-y-1">
              {expiringSubscriptions.slice(0, 3).map((student: any) => (
                <li key={student.id} className="text-sm border-b pb-1">
                  {student.name} - 
                  {student.subscription_type === 'per_session' 
                    ? ` متبقي ${student.sessions_remaining} جلسات` 
                    : ` متبقي ${student.days_remaining} يوم`
                  }
                </li>
              ))}
            </ul>
            
            {expiringSubscriptions.length > 3 && (
              <div className="text-sm text-muted-foreground mt-2">
                و {expiringSubscriptions.length - 3} اشتراكات أخرى...
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => navigate('/students')}
            >
              عرض جميع الاشتراكات
            </Button>
          </div>
        )}
        
        {(!expiringSubscriptions || expiringSubscriptions.length === 0) && (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            لا توجد اشتراكات على وشك الانتهاء
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionWarnings;
