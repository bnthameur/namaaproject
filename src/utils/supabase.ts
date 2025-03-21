import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);

// Log warning if credentials are missing
if (!hasSupabaseCredentials) {
  console.warn('Supabase credentials missing. Running in mock mode. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables for production use.');
}

// Create Supabase client
export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabaseClient();

// Create a mock Supabase client when credentials are not available
function mockSupabaseClient() {
  // This is a very simple mock implementation
  // Return a mock object that simulates Supabase behavior without making actual API calls
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: () => ({
          single: async () => ({ data: mockData[table]?.[0] || null, error: null }),
          order: () => ({ data: mockData[table] || [], error: null })
        }),
        order: () => ({ data: mockData[table] || [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data, error: null })
        })
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({ error: null })
      })
    }),
    rpc: (func: string, params?: any) => {
      // Mock RPC functions
      const mockRpcResponses: Record<string, any> = {
        get_active_students_count: 42,
        get_total_income_current_month: 290000,
        get_total_expenses_current_month: 210000,
        get_teacher_earnings: 57600
      };
      
      return { data: mockRpcResponses[func] || 0, error: null };
    }
  };
}

// Mock data for testing when Supabase is not connected
const mockData: Record<string, any[]> = {
  students: [
    { id: '1', name: 'سامي محمد', age: 8, category: 'التوحد', teacher_id: '1', active: true },
    { id: '2', name: 'فاطمة عبد الله', age: 7, category: 'صعوبات التعلم', teacher_id: '2', active: true },
    { id: '3', name: 'يوسف عمر', age: 9, category: 'مشاكل الذاكرة', teacher_id: '3', active: true }
  ],
  teachers: [
    { id: '1', name: 'فاطمة بوزيد', specialty: 'التوحد', active: true },
    { id: '2', name: 'مريم عمراني', specialty: 'صعوبات التعلم', active: true },
    { id: '3', name: 'خديجة مرابط', specialty: 'مشاكل الذاكرة', active: true },
    { id: '4', name: 'سعاد لعريبي', specialty: 'الفصل التحضيري', active: true }
  ],
  transactions: [
    { 
      id: '1', 
      date: new Date().toISOString(), 
      type: 'دخل', 
      amount: 5000, 
      description: 'اشتراك شهري', 
      student_id: '1',
      teacher_id: null,
      students: { id: '1', name: 'سامي محمد' },
      teachers: null
    },
    { 
      id: '2', 
      date: new Date().toISOString(), 
      type: 'مصروف', 
      amount: 2000, 
      description: 'دفع للمعلمة', 
      student_id: null,
      teacher_id: '1',
      students: null,
      teachers: { id: '1', name: 'فاطمة بوزيد' }
    }
  ]
};

// Students
export const getStudents = async () => {
  if (!hasSupabaseCredentials) {
    // Return mock data when Supabase is not connected
    return mockData.students.map(student => ({
      ...student,
      teachers: mockData.teachers.find(t => t.id === student.teacher_id) || null
    }));
  }

  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      teachers (
        id,
        name
      )
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
  
  return data;
};

export const getStudentById = async (id: string) => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      teachers (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const createStudent = async (student: any) => {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating student:', error);
    throw error;
  }
  
  return data;
};

export const updateStudent = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteStudent = async (id: string) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

// Teachers
export const getTeachers = async () => {
  if (!hasSupabaseCredentials) {
    // Return mock data when Supabase is not connected
    return mockData.teachers;
  }

  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
  
  return data;
};

export const getTeacherById = async (id: string) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const createTeacher = async (teacher: any) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert(teacher)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
  
  return data;
};

export const updateTeacher = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('teachers')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteTeacher = async (id: string) => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting teacher with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

// Transactions
export const getTransactions = async () => {
  if (!hasSupabaseCredentials) {
    // Return mock data when Supabase is not connected
    return mockData.transactions;
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      students (
        id,
        name
      ),
      teachers (
        id,
        name
      )
    `)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data;
};

export const getTransactionById = async (id: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      students (
        id,
        name
      ),
      teachers (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const createTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
  
  return data;
};

export const updateTransaction = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating transaction with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting transaction with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  if (!hasSupabaseCredentials) {
    // Return mock data when Supabase is not connected
    return {
      activeStudentsCount: 42,
      currentMonthIncome: 290000,
      currentMonthExpenses: 210000,
      teacherEarnings: mockData.teachers.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        earnings: 57600 / mockData.teachers.length
      }))
    };
  }

  const { data: activeStudentsCount, error: countError } = await supabase
    .rpc('get_active_students_count');

  if (countError) {
    console.error('Error fetching active students count:', countError);
  }

  const { data: currentMonthIncome, error: incomeError } = await supabase
    .rpc('get_total_income_current_month');

  if (incomeError) {
    console.error('Error fetching current month income:', incomeError);
  }

  const { data: currentMonthExpenses, error: expensesError } = await supabase
    .rpc('get_total_expenses_current_month');

  if (expensesError) {
    console.error('Error fetching current month expenses:', expensesError);
  }

  // Get teacher earnings
  const { data: teachers, error: teachersError } = await supabase
    .from('teachers')
    .select('id, name')
    .eq('active', true);

  if (teachersError) {
    console.error('Error fetching teachers:', teachersError);
  }

  const teacherEarnings = [];
  
  if (teachers) {
    for (const teacher of teachers) {
      const { data: earnings, error: earningsError } = await supabase
        .rpc('get_teacher_earnings', { teacher_uuid: teacher.id });
      
      if (earningsError) {
        console.error(`Error fetching earnings for teacher ${teacher.id}:`, earningsError);
      } else {
        teacherEarnings.push({
          id: teacher.id,
          name: teacher.name,
          earnings: earnings || 0
        });
      }
    }
  }

  return {
    activeStudentsCount: activeStudentsCount || 0,
    currentMonthIncome: currentMonthIncome || 0,
    currentMonthExpenses: currentMonthExpenses || 0,
    teacherEarnings
  };
};
