
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTeacherById, getTeacherStudents, getTeacherTransactions } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { Loader2, User, Calendar, Phone, Users, PiggyBank, Info, BookText } from 'lucide-react';
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

interface TeacherDetailsProps {
  teacherId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ teacherId, isOpen, onClose }) => {
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

  // Calculate total earnings
  const totalEarnings = transactions.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0);
  }, 0);

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
                <span>المدفوعات</span>
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
                <CardDescription>إجمالي المدفوعات: {totalEarnings.toLocaleString()} د.ج</CardDescription>
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
                            <span className={transaction.type === 'دخل' 
                              ? 'text-green-600' 
                              : 'text-red-600'}>
                              {transaction.type}
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
