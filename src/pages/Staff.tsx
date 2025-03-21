
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data
const staff = Array.from({ length: 10 }).map((_, i) => ({
  id: 5001 + i,
  name: ['Dr. Robert Johnson', 'Mrs. Sarah Williams', 'Mr. Michael Brown', 'Ms. Jennifer Davis', 'Mr. Daniel Martinez', 
         'Dr. Emily Wilson', 'Mrs. Lisa Anderson', 'Mr. David Taylor', 'Ms. Elizabeth Thomas', 'Mr. James Harris'][i],
  role: ['Principal', 'Vice Principal', 'Math Teacher', 'Science Teacher', 'English Teacher', 
         'History Teacher', 'Art Teacher', 'Physical Education', 'Counselor', 'Librarian'][i % 10],
  department: ['Administration', 'Administration', 'Mathematics', 'Science', 'Languages', 
              'Social Sciences', 'Arts', 'Physical Education', 'Student Services', 'Library'][i % 10],
  joinDate: new Date(2020 + Math.floor(i/3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  salary: [80000, 70000, 60000, 60000, 58000, 62000, 57000, 55000, 59000, 54000][i],
  status: ['Active', 'Active', 'Active', 'On Leave', 'Active', 'Active', 'Active', 'Active', 'Active', 'On Leave'][i % 10 === 3 || i % 10 === 9 ? 1 : 0],
  contact: ['(555) 123-4567', '(555) 234-5678', '(555) 345-6789', '(555) 456-7890', 
           '(555) 567-8901', '(555) 678-9012', '(555) 789-0123', '(555) 890-1234',
           '(555) 901-2345', '(555) 012-3456'][i],
  email: [
    'robert.johnson@school.edu', 'sarah.williams@school.edu', 'michael.brown@school.edu', 
    'jennifer.davis@school.edu', 'daniel.martinez@school.edu', 'emily.wilson@school.edu', 
    'lisa.anderson@school.edu', 'david.taylor@school.edu', 'elizabeth.thomas@school.edu', 
    'james.harris@school.edu'
  ][i],
}));

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStaff = staff.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Teaching and non-teaching staff
  const teachingStaff = staff.filter(person => 
    ['Math Teacher', 'Science Teacher', 'English Teacher', 'History Teacher', 'Art Teacher', 'Physical Education'].includes(person.role)
  );
  
  const nonTeachingStaff = staff.filter(person => 
    !['Math Teacher', 'Science Teacher', 'English Teacher', 'History Teacher', 'Art Teacher', 'Physical Education'].includes(person.role)
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Staff</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-blue-600">36</div>
          <div className="text-sm text-muted-foreground mt-1">Total Staff</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-green-600">24</div>
          <div className="text-sm text-muted-foreground mt-1">Teaching Staff</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-amber-600">12</div>
          <div className="text-sm text-muted-foreground mt-1">Non-Teaching Staff</div>
        </BlurCard>
        
        <BlurCard className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-purple-600">2</div>
          <div className="text-sm text-muted-foreground mt-1">On Leave</div>
        </BlurCard>
      </div>
      
      <BlurCard>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="teaching">Teaching</TabsTrigger>
              <TabsTrigger value="non-teaching">Non-Teaching</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search staff..."
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
          
          <TabsContent value="all">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
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
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{person.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{person.role}</TableCell>
                      <TableCell>{person.department}</TableCell>
                      <TableCell>${person.salary.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          person.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {person.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{person.email}</span>
                          <span>{person.contact}</span>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Salary History</DropdownMenuItem>
                            <DropdownMenuItem>Attendance Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="teaching">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachingStaff
                    .filter(person => 
                      searchTerm === '' || 
                      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      person.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">{person.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {person.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{person.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>{person.department}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            person.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {person.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{person.email}</span>
                            <span>{person.contact}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="non-teaching">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonTeachingStaff
                    .filter(person => 
                      searchTerm === '' || 
                      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      person.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">{person.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {person.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{person.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>{person.department}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            person.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {person.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{person.email}</span>
                            <span>{person.contact}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </BlurCard>
    </div>
  );
};

export default Staff;
