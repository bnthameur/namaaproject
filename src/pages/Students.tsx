
import React, { useState } from 'react';
import { Download, Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
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

// Sample data - Algerian students with Arabic names
const students = [
  {
    id: 1001,
    name: 'يوسف بن سالم',
    category: 'التوحد',
    age: 8,
    feesStatus: 'مدفوع',
    attendance: 92,
    parentName: 'عبد القادر بن سالم',
    contactNumber: '0661234567',
  },
  {
    id: 1002,
    name: 'فاطمة الزهراء مرزوقي',
    category: 'صعوبات التعلم',
    age: 10,
    feesStatus: 'قيد الانتظار',
    attendance: 87,
    parentName: 'مراد مرزوقي',
    contactNumber: '0551234567',
  },
  {
    id: 1003,
    name: 'أيمن عبد النور',
    category: 'مشاكل الذاكرة',
    age: 7,
    feesStatus: 'جزئي',
    attendance: 95,
    parentName: 'محمد عبد النور',
    contactNumber: '0771234567',
  },
  {
    id: 1004,
    name: 'سلمى بوشامة',
    category: 'حالات طبية',
    age: 9,
    feesStatus: 'مدفوع',
    attendance: 80,
    parentName: 'سهيلة بوشامة',
    contactNumber: '0661234568',
  },
  {
    id: 1005,
    name: 'عبد الرحمن قاسي',
    category: 'صعوبات التعلم',
    age: 11,
    feesStatus: 'مدفوع',
    attendance: 98,
    parentName: 'صالح قاسي',
    contactNumber: '0551234568',
  },
  {
    id: 1006,
    name: 'زينب مخلوفي',
    category: 'الفصل التحضيري',
    age: 6,
    feesStatus: 'قيد الانتظار',
    attendance: 89,
    parentName: 'نورة مخلوفي',
    contactNumber: '0771234568',
  },
  {
    id: 1007,
    name: 'رياض توفيق',
    category: 'التوحد',
    age: 10,
    feesStatus: 'مدفوع',
    attendance: 93,
    parentName: 'سفيان توفيق',
    contactNumber: '0661234569',
  },
  {
    id: 1008,
    name: 'أمينة بوضياف',
    category: 'حالات طبية',
    age: 8,
    feesStatus: 'جزئي',
    attendance: 85,
    parentName: 'ليلى بوضياف',
    contactNumber: '0551234569',
  },
  {
    id: 1009,
    name: 'محمد أمين علي',
    category: 'مشاكل الذاكرة',
    age: 9,
    feesStatus: 'مدفوع',
    attendance: 91,
    parentName: 'عماد علي',
    contactNumber: '0771234569',
  },
  {
    id: 1010,
    name: 'ياسمين بن عودة',
    category: 'الفصل التحضيري',
    age: 5,
    feesStatus: 'قيد الانتظار',
    attendance: 96,
    parentName: 'فريد بن عودة',
    contactNumber: '0661234570',
  },
];

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStudents = students.filter(student => 
    student.name.includes(searchTerm) ||
    student.id.toString().includes(searchTerm)
  );

  // Student category counts
  const categoryCount = {
    autism: students.filter(s => s.category === 'التوحد').length,
    learning: students.filter(s => s.category === 'صعوبات التعلم').length,
    memory: students.filter(s => s.category === 'مشاكل الذاكرة').length,
    medical: students.filter(s => s.category === 'حالات طبية').length,
    prep: students.filter(s => s.category === 'الفصل التحضيري').length,
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
        
        <Button className="flex items-center gap-2">
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
                <TableHead>رقم الطالب</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>العمر</TableHead>
                <TableHead>حالة الدفع</TableHead>
                <TableHead>الحضور</TableHead>
                <TableHead>ولي الأمر</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
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
                  <TableCell>{student.category}</TableCell>
                  <TableCell>{student.age} سنوات</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      student.feesStatus === 'مدفوع' 
                        ? 'bg-green-100 text-green-700' 
                        : student.feesStatus === 'قيد الانتظار'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.feesStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            student.attendance >= 95 
                              ? 'bg-green-500' 
                              : student.attendance >= 90
                                ? 'bg-blue-500'
                                : student.attendance >= 85
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm">{student.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                        <DropdownMenuItem>تعديل بيانات الطالب</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>سجل الدفع</DropdownMenuItem>
                        <DropdownMenuItem>سجل الحضور</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">إزالة الطالب</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </BlurCard>
    </div>
  );
};

export default Students;
