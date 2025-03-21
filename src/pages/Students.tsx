
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

// Sample data
const students = Array.from({ length: 10 }).map((_, i) => ({
  id: 10001 + i,
  name: ['Emma Thompson', 'James Wilson', 'Olivia Martinez', 'Noah Johnson', 'Sophia Lee', 
         'William Davis', 'Isabella Rodriguez', 'Benjamin Taylor', 'Mia Harris', 'Lucas Clark'][i],
  grade: ['Grade 10', 'Grade 11', 'Grade 9', 'Grade 10', 'Grade 12', 
          'Grade 11', 'Grade 9', 'Grade 12', 'Grade 10', 'Grade 11'][i],
  section: ['A', 'B', 'A', 'C', 'A', 'B', 'C', 'A', 'B', 'A'][i],
  feesStatus: ['Paid', 'Pending', 'Partial', 'Paid', 'Paid', 'Pending', 'Paid', 'Partial', 'Paid', 'Pending'][i],
  attendance: [98, 87, 92, 95, 100, 88, 96, 91, 94, 89][i],
  parentName: ['David & Sarah Thompson', 'Robert & Mary Wilson', 'Carlos & Elena Martinez', 'Michael & Lisa Johnson',
              'John & Min Lee', 'Thomas & Jennifer Davis', 'Miguel & Carmen Rodriguez', 'Richard & Emily Taylor',
              'Daniel & Sophia Harris', 'Andrew & Jessica Clark'][i],
  contactNumber: ['(555) 123-4567', '(555) 234-5678', '(555) 345-6789', '(555) 456-7890', 
                  '(555) 567-8901', '(555) 678-9012', '(555) 789-0123', '(555) 890-1234',
                  '(555) 901-2345', '(555) 012-3456'][i],
}));

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toString().includes(searchTerm)
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Student Management</h1>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-blue-600">248</div>
          <div className="text-sm text-muted-foreground mt-1">Total Students</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-green-600">92%</div>
          <div className="text-sm text-muted-foreground mt-1">Fee Collection</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-amber-600">94%</div>
          <div className="text-sm text-muted-foreground mt-1">Attendance Rate</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-purple-600">32</div>
          <div className="text-sm text-muted-foreground mt-1">New Admissions</div>
        </BlurCard>
      </div>
      
      <BlurCard>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Students List</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
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
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade & Section</TableHead>
                <TableHead>Fees Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
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
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.grade} - {student.section}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      student.feesStatus === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : student.feesStatus === 'Pending'
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Student</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Payment History</DropdownMenuItem>
                        <DropdownMenuItem>Attendance Record</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Remove Student</DropdownMenuItem>
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
