import React, { useState, useEffect } from 'react';
import { Download, Filter, MoreHorizontal, Plus, Search, Pencil, Trash, Eye } from 'lucide-react';
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
import { getStudents, deleteStudent } from '@/utils/supabase';
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
import StudentForm from '@/components/students/StudentForm';
import StudentDetails from '@/components/students/StudentDetails';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['students']});
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطالب بنجاح',
      });
      setDeleteConfirmOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الطالب. حاول مرة أخرى.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    },
  });

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id?.toString().includes(searchTerm)
  );

  const handleDeleteStudent = (id: string) => {
    setStudentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudentMutation.mutate(studentToDelete);
    }
  };

  const categoryCount = {
    autism: students.filter(s => s.category === 'autism').length,
    learning: students.filter(s => s.category === 'learning_difficulties').length,
    memory: students.filter(s => s.category === 'memory_issues').length,
    medical: students.filter(s => s.category === 'medical_conditions').length,
    prep: students.filter(s => s.category === 'preparatory').length,
  };

  const categoryTranslation: Record<string, string> = {
    'autism': 'التوحد',
    'learning_difficulties': 'صعوبات التعلم',
    'memory_issues': 'مشاكل الذاكرة',
    'medical_conditions': 'حالات طبية',
    'preparatory': 'الفصل التحضيري'
  };

  const exportStudentsList = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      doc.setR2L(true);
      
      doc.setFontSize(18);
      doc.text('قائمة الطلاب', doc.internal.pageSize.width / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`, doc.internal.pageSize.width - 15, 25, { align: 'right' });
      
      const tableHeaders = [['الرقم', 'الاسم', 'العمر', 'الفئة', 'الاشتراك', 'المعلمة', 'الحالة']];
      
      const tableData = filteredStudents.map((student) => [
        student.id.substring(0, 8),
        student.name,
        `${student.age} سنوات`,
        categoryTranslation[student.category] || student.category,
        `${student.subscription_fee?.toLocaleString() || 0} د.ج`,
        student.teachers?.name || 'غير معين',
        student.active ? 'نشط' : 'غير نشط'
      ]);
      
      doc.autoTable({
        head: tableHeaders,
        body: tableData,
        startY: 30,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          halign: 'center',
          valign: 'middle'
        },
        bodyStyles: {
          fontSize: 10,
          halign: 'center',
          valign: 'middle'
        },
        margin: { top: 30 },
        didDrawPage: function (data: any) {
          doc.setFontSize(10);
          doc.text(`الصفحة ${doc.getNumberOfPages()}`, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 10, { align: 'right' });
        }
      });
      
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'students-list.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير قائمة الطلاب بنجاح",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء ملف PDF. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingStudent(null);
            setShowAddStudent(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>إضافة طالب</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-blue-600">{students.length}</div>
          <div className="text-sm text-muted-foreground mt-1">مجموع الطلاب</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-red-600">{categoryCount.autism}</div>
          <div className="text-sm text-muted-foreground mt-1">التوحد</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-green-600">{categoryCount.learning}</div>
          <div className="text-sm text-muted-foreground mt-1">صعوبات التعلم</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-amber-600">{categoryCount.memory + categoryCount.medical}</div>
          <div className="text-sm text-muted-foreground mt-1">مشاكل صحية</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-purple-600">{categoryCount.prep}</div>
          <div className="text-sm text-muted-foreground mt-1">الفصل التحضيري</div>
        </BlurCard>
      </div>
      
      <BlurCard>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">قائمة الطلاب</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="بحث عن الطلاب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={exportStudentsList}>
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
                  <TableHead>رقم الطالب</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>العمر</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الاشتراك</TableHead>
                  <TableHead>المعلمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.age} سنوات</TableCell>
                    <TableCell>{categoryTranslation[student.category] || student.category}</TableCell>
                    <TableCell>{student.subscription_fee?.toLocaleString() || 0} د.ج</TableCell>
                    <TableCell>{student.teachers?.name || 'غير معين'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {student.active ? 'نشط' : 'غير نشط'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setViewingStudent(student.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingStudent(student);
                            setShowAddStudent(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      لا توجد طلاب مطابقين لبحثك
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </BlurCard>

      {showAddStudent && (
        <StudentForm 
          student={editingStudent}
          isOpen={showAddStudent} 
          onClose={() => {
            setShowAddStudent(false);
            setEditingStudent(null);
          }}
        />
      )}

      {viewingStudent && (
        <StudentDetails 
          studentId={viewingStudent}
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الطالب؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف بيانات الطالب بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteStudentMutation.isPending}
            >
              {deleteStudentMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : 'تأكيد الحذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;

