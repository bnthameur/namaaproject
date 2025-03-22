
import React, { useState, useEffect } from 'react';
import { Download, Filter, MoreHorizontal, Plus, Search, Users, Pencil, Trash, Eye } from 'lucide-react';
import BlurCard from '@/components/ui/BlurCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getTeachers, deleteTeacher } from '@/utils/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import TeacherForm from '@/components/teachers/TeacherForm';
import TeacherDetails from '@/components/teachers/TeacherDetails';

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [viewingTeacher, setViewingTeacher] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teachers data
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers
  });

  // Delete teacher mutation
  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['teachers']});
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المعلمة بنجاح',
      });
      setDeleteConfirmOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'فشل حذف المعلمة. حاول مرة أخرى.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    },
  });
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTeacher = (id: string) => {
    setTeacherToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacherMutation.mutate(teacherToDelete);
    }
  };

  // Calculate statistics
  const activeTeachers = teachers.filter(teacher => teacher.active).length;
  const totalStudents = teachers.reduce((sum, teacher) => sum + (teacher.student_count || 0), 0);
  const totalEarnings = teachers.reduce((sum, teacher) => {
    // Calculate earnings based on percentage if available
    const earnings = (teacher.student_fees || 0) * (teacher.percentage || 0) / 100;
    return sum + earnings;
  }, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة المعلمات</h1>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingTeacher(null);
            setShowAddTeacher(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>إضافة معلمة</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-blue-600">{teachers.length}</div>
          <div className="text-sm text-muted-foreground mt-1">مجموع المعلمات</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-green-600">{totalStudents}</div>
          <div className="text-sm text-muted-foreground mt-1">مجموع الطلاب المسجلين</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-amber-600">{activeTeachers}</div>
          <div className="text-sm text-muted-foreground mt-1">المعلمات النشطات</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-purple-600">{totalEarnings.toLocaleString()} د.ج</div>
          <div className="text-sm text-muted-foreground mt-1">مستحقات المعلمات</div>
        </BlurCard>
      </div>
      
      <BlurCard>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">قائمة المعلمات</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="بحث عن المعلمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>النسبة المئوية</TableHead>
                  <TableHead>الطلاب</TableHead>
                  <TableHead>المستحقات الشهرية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  const earnings = (teacher.student_fees || 0) * (teacher.percentage || 0) / 100;
                  const studentPercent = teacher.student_count ? (teacher.student_count / (totalStudents || 1)) * 100 : 0;
                  
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {teacher.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{teacher.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.phone || 'غير متوفر'}</TableCell>
                      <TableCell>{teacher.percentage || 0}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{teacher.student_count || 0} طالب</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {earnings.toLocaleString()} د.ج
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {teacher.active ? 'نشطة' : 'غير نشطة'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setViewingTeacher(teacher.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setShowAddTeacher(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      لا توجد معلمات مطابقة لبحثك
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">نظام الأرباح للمعلمات</h3>
          <p className="text-sm text-blue-600 mb-2">تحصل المعلمات على نسبة من اشتراك كل طالب يدرسونه، وتختلف هذه النسبة حسب:</p>
          <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
            <li>نسبة المعلمة المتفق عليها</li>
            <li>عدد الطلاب المسجلين مع المعلمة</li>
            <li>اشتراكات الطلاب المدفوعة</li>
          </ul>
        </div>
      </BlurCard>

      {/* Teacher Form Dialog */}
      {showAddTeacher && (
        <TeacherForm 
          teacher={editingTeacher}
          isOpen={showAddTeacher} 
          onClose={() => {
            setShowAddTeacher(false);
            setEditingTeacher(null);
          }}
        />
      )}

      {/* Teacher Details */}
      {viewingTeacher && (
        <TeacherDetails 
          teacherId={viewingTeacher}
          isOpen={!!viewingTeacher}
          onClose={() => setViewingTeacher(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه المعلمة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف بيانات المعلمة بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteTeacherMutation.isPending}
            >
              {deleteTeacherMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : 'تأكيد الحذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Staff;
