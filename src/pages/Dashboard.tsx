
import React from 'react';
import FinanceSummary from '@/components/dashboard/FinanceSummary';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BlurCard from '@/components/ui/BlurCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, UserCheck, Book, Percent } from 'lucide-react';

const monthlyData = [
  { name: 'جانفي', income: 240000, expense: 180000 },
  { name: 'فيفري', income: 260000, expense: 170000 },
  { name: 'مارس', income: 250000, expense: 200000 },
  { name: 'أفريل', income: 270000, expense: 190000 },
  { name: 'ماي', income: 290000, expense: 210000 },
  { name: 'جوان', income: 280000, expense: 220000 },
  { name: 'جويلية', income: 300000, expense: 230000 },
  { name: 'أوت', income: 310000, expense: 240000 },
  { name: 'سبتمبر', income: 320000, expense: 250000 },
];

// Algerian teachers with their earnings and students
const teacherEarnings = [
  { name: 'فاطمة بوزيد', students: 12, earnings: 57600 },
  { name: 'مريم عمراني', students: 10, earnings: 42000 },
  { name: 'خديجة مرابط', students: 9, earnings: 36000 },
  { name: 'سعاد لعريبي', students: 11, earnings: 44000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      
      <FinanceSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <BlurCard className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">نظرة مالية عامة</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={80} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [`${value} د.ج`, undefined]}
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
                />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="الدخل" />
                <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} name="المصاريف" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BlurCard>
        
        <BlurCard>
          <h2 className="text-xl font-semibold mb-4">الإحصائيات</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="text-sm font-medium text-blue-700">مجموع الطلاب</div>
              <div className="text-2xl font-bold">42</div>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="text-sm font-medium text-purple-700">المعلمات</div>
              <div className="text-2xl font-bold">4</div>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="text-sm font-medium text-amber-700">متوسط الاشتراك</div>
              <div className="text-2xl font-bold">4000 د.ج</div>
            </div>
            
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-sm font-medium text-emerald-700">نسبة الحضور</div>
              <div className="text-2xl font-bold">89%</div>
            </div>
          </div>
        </BlurCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <BlurCard>
          <h2 className="text-xl font-semibold mb-4">أرباح المعلمات</h2>
          <div className="space-y-4">
            {teacherEarnings.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {teacher.students} طالب
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-medium">{teacher.earnings.toLocaleString()} د.ج</div>
              </div>
            ))}
          </div>
        </BlurCard>
        
        <BlurCard>
          <h2 className="text-xl font-semibold mb-4">توزيع الطلاب حسب الفئة</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>التوحد</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">14</span>
                <span className="text-xs text-muted-foreground">33%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>صعوبات التعلم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">11</span>
                <span className="text-xs text-muted-foreground">26%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>مشاكل الذاكرة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">8</span>
                <span className="text-xs text-muted-foreground">19%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>حالات طبية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">5</span>
                <span className="text-xs text-muted-foreground">12%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>طلاب الفصل التحضيري</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">4</span>
                <span className="text-xs text-muted-foreground">10%</span>
              </div>
            </div>
          </div>
        </BlurCard>
      </div>
      
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
