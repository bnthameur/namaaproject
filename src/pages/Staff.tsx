
import React, { useState } from 'react';
import { Download, Filter, MoreHorizontal, Plus, Search, Users, DollarSign, Star } from 'lucide-react';
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

// Sample data - Algerian female teachers with Arabic names
const staff = [
  {
    id: 1001,
    name: 'فاطمة بوزيد',
    role: 'معلمة رئيسية',
    specialty: 'صعوبات التعلم',
    joinDate: new Date(2020, 6, 15),
    students: 12,
    studentPercent: 40,
    earnings: 57600,
    status: 'نشطة',
    contactNumber: '0661234567',
  },
  {
    id: 1002,
    name: 'مريم عمراني',
    role: 'معلمة',
    specialty: 'التوحد',
    joinDate: new Date(2021, 3, 10),
    students: 10,
    studentPercent: 35,
    earnings: 42000,
    status: 'نشطة',
    contactNumber: '0551234567',
  },
  {
    id: 1003,
    name: 'خديجة مرابط',
    role: 'معلمة',
    specialty: 'مشاكل الذاكرة',
    joinDate: new Date(2022, 1, 5),
    students: 9,
    studentPercent: 30,
    earnings: 36000,
    status: 'إجازة',
    contactNumber: '0771234567',
  },
  {
    id: 1004,
    name: 'سعاد لعريبي',
    role: 'معلمة مساعدة',
    specialty: 'الفصل التحضيري',
    joinDate: new Date(2022, 9, 20),
    students: 11,
    studentPercent: 25,
    earnings: 44000,
    status: 'نشطة',
    contactNumber: '0661234568',
  },
];

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStaff = staff.filter(person => 
    person.name.includes(searchTerm) ||
    person.role.includes(searchTerm) ||
    person.specialty.includes(searchTerm)
  );

  const totalStudents = staff.reduce((sum, teacher) => sum + teacher.students, 0);
  const totalEarnings = staff.reduce((sum, teacher) => sum + teacher.earnings, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة المعلمات</h1>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>إضافة معلمة</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-blue-600">{staff.length}</div>
          <div className="text-sm text-muted-foreground mt-1">مجموع المعلمات</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-green-600">{totalStudents}</div>
          <div className="text-sm text-muted-foreground mt-1">مجموع الطلاب المسجلين</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-amber-600">{staff.filter(t => t.status === 'نشطة').length}</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>التخصص</TableHead>
                <TableHead>الطلاب</TableHead>
                <TableHead>النسبة المئوية</TableHead>
                <TableHead>المستحقات الشهرية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {person.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{person.name}</div>
                        <div className="text-xs text-muted-foreground">{person.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{person.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{person.students} طالب</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span>{person.studentPercent}%</span>
                      </div>
                      <Progress value={person.studentPercent} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {person.earnings.toLocaleString()} د.ج
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      person.status === 'نشطة' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {person.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{person.contactNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem>عرض الملف الشخصي</DropdownMenuItem>
                        <DropdownMenuItem>تعديل البيانات</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>سجل المدفوعات</DropdownMenuItem>
                        <DropdownMenuItem>قائمة الطلاب</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">تعطيل الحساب</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">نظام الأرباح للمعلمات</h3>
          <p className="text-sm text-blue-600 mb-2">تحصل المعلمات على نسبة من اشتراك كل طالب يدرسونه، وتختلف هذه النسبة حسب:</p>
          <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
            <li>تخصص المعلمة والفئة التي تدرسها</li>
            <li>عدد سنوات الخبرة في المركز</li>
            <li>عدد الطلاب المسجلين مع المعلمة</li>
          </ul>
          <div className="flex items-center mt-3 gap-2 text-amber-600">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">يتم حساب المستحقات شهرياً على أساس الاشتراكات المدفوعة</span>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default Staff;
