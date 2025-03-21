
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Students
export const getStudents = async () => {
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
