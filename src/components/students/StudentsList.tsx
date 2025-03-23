
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { calculateSubscriptionStatus } from '@/utils/supabase';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import { PencilLine, Eye, AlertCircle } from 'lucide-react';

interface StudentsListProps {
  students: any[];
  onEdit: (student: any) => void;
  onView: (studentId: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  students, 
  onEdit, 
  onView 
}) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg">لم يتم العثور على أي طلاب</p>
        <p className="text-sm">يمكنك إضافة طالب جديد باستخدام زر "إضافة طالب"</p>
      </div>
    );
  }
  
  const getSubscriptionTypeLabel = (type: string) => {
    switch(type) {
      case 'monthly': return 'شهري';
      case 'weekly': return 'أسبوعي';
      case 'per_session': return 'بالجلسة';
      case 'course': return 'دورة';
      default: return type || 'شهري';
    }
  };
  
  const getDaysRemaining = (student: any) => {
    if (!student.subscription_end_date) return undefined;
    return Math.ceil((new Date(student.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الاسم</TableHead>
          <TableHead>المعلمة</TableHead>
          <TableHead>نوع الاشتراك</TableHead>
          <TableHead>قيمة الاشتراك</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="text-left w-28">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          const subscriptionStatus = calculateSubscriptionStatus(student);
          
          return (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                {student.name}
                {student.active === false && (
                  <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    غير نشط
                  </span>
                )}
              </TableCell>
              <TableCell>{student.teachers?.name || 'غير معين'}</TableCell>
              <TableCell>{getSubscriptionTypeLabel(student.subscription_type)}</TableCell>
              <TableCell>{student.subscription_fee?.toLocaleString()} د.ج</TableCell>
              <TableCell>
                <SubscriptionStatusBadge 
                  status={subscriptionStatus}
                  type={student.subscription_type}
                  daysRemaining={getDaysRemaining(student)}
                  sessionsRemaining={student.sessions_remaining}
                />
              </TableCell>
              <TableCell className="space-x-1 space-y-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onView(student.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(student)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StudentsList;
