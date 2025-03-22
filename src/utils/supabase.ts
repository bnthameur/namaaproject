import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables or use the provided ones
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  try {
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating student with ID ${id}:`, error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
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

export const getTeacherStudents = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('name');
  
  if (error) {
    console.error(`Error fetching students for teacher ${teacherId}:`, error);
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
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating teacher with ID ${id}:`, error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw error;
  }
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

// Get teacher earnings per student (for real-time tracking)
export const getTeacherEarningsPerStudent = async (teacherId: string) => {
  const { data: students, error } = await supabase
    .from('students')
    .select('id, name, subscription_fee')
    .eq('teacher_id', teacherId)
    .eq('active', true);
  
  if (error) {
    console.error(`Error fetching students for teacher ${teacherId}:`, error);
    throw error;
  }
  
  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('percentage')
    .eq('id', teacherId)
    .single();
  
  if (teacherError) {
    console.error(`Error fetching teacher percentage for ${teacherId}:`, teacherError);
    throw teacherError;
  }
  
  // Calculate earnings for each student
  const earningsData = students.map(student => ({
    student_id: student.id,
    student_name: student.name,
    subscription_fee: student.subscription_fee,
    teacher_earnings: Math.round((student.subscription_fee * teacher.percentage) / 100)
  }));
  
  return earningsData;
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

export const getStudentTransactions = async (studentId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      students (
        id,
        name
      )
    `)
    .eq('student_id', studentId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching transactions for student ${studentId}:`, error);
    throw error;
  }
  
  return data;
};

export const getTeacherTransactions = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      teachers (
        id,
        name
      )
    `)
    .eq('teacher_id', teacherId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching transactions for teacher ${teacherId}:`, error);
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
  try {
    console.log("Creating transaction:", transaction);
    const processedTransaction = {
      ...transaction,
      date: transaction.date instanceof Date ? transaction.date : new Date(transaction.date),
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(processedTransaction)
      .select();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating transaction with ID ${id}:`, error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error(`Error updating transaction with ID ${id}:`, error);
    throw error;
  }
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

// Enhanced Dashboard Statistics with real-time teacher payment tracking
export const getDashboardStats = async () => {
  // Get active students count
  const { data: activeStudentsCount, error: countError } = await supabase
    .rpc('get_active_students_count');

  if (countError) {
    console.error('Error fetching active students count:', countError);
  }

  // Get income for current month
  const { data: currentMonthIncome, error: incomeError } = await supabase
    .rpc('get_total_income_current_month');

  if (incomeError) {
    console.error('Error fetching current month income:', incomeError);
  }

  // Get expenses for current month
  const { data: currentMonthExpenses, error: expensesError } = await supabase
    .rpc('get_total_expenses_current_month');

  if (expensesError) {
    console.error('Error fetching current month expenses:', expensesError);
  }

  // Get active teachers
  const { data: teachers, error: teachersError } = await supabase
    .from('teachers')
    .select('id, name, percentage')
    .eq('active', true);

  if (teachersError) {
    console.error('Error fetching teachers:', teachersError);
  }

  // Calculate each teacher's current earnings and payment status
  const teacherEarnings = [];
  
  if (teachers) {
    for (const teacher of teachers) {
      // Get teacher's active students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('subscription_fee')
        .eq('teacher_id', teacher.id)
        .eq('active', true);
      
      if (studentsError) {
        console.error(`Error fetching students for teacher ${teacher.id}:`, studentsError);
        continue;
      }
      
      // Calculate total potential earnings from all active students
      const totalPotentialEarnings = students.reduce((sum, student) => {
        return sum + (student.subscription_fee * teacher.percentage / 100);
      }, 0);
      
      // Get payments made to this teacher
      const { data: payments, error: paymentsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('teacher_id', teacher.id)
        .eq('type', 'expense')
        .eq('category', 'teacher_payout');
      
      if (paymentsError) {
        console.error(`Error fetching payments for teacher ${teacher.id}:`, paymentsError);
        continue;
      }
      
      // Calculate total payments made
      const totalPayments = payments.reduce((sum, payment) => {
        return sum + payment.amount;
      }, 0);
      
      // Calculate what is currently owed
      const currentlyOwed = totalPotentialEarnings - totalPayments;
      
      teacherEarnings.push({
        id: teacher.id,
        name: teacher.name,
        potentialEarnings: totalPotentialEarnings,
        paidAmount: totalPayments,
        owedAmount: currentlyOwed,
        studentCount: students.length
      });
    }
  }

  // Get recent transactions for the dashboard
  const { data: recentTransactions, error: recentTransactionsError } = await supabase
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
    .order('date', { ascending: false })
    .limit(5);

  if (recentTransactionsError) {
    console.error('Error fetching recent transactions:', recentTransactionsError);
  }

  return {
    activeStudentsCount: activeStudentsCount || 0,
    currentMonthIncome: currentMonthIncome || 0,
    currentMonthExpenses: currentMonthExpenses || 0,
    teacherEarnings: teacherEarnings,
    recentTransactions: recentTransactions || []
  };
};

// Get detailed monthly financial summary
export const getMonthlyFinancialSummary = async (year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
  // Format date range for the query
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month
  
  // Get all transactions for the month
  const { data: transactions, error } = await supabase
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
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching monthly transactions:', error);
    throw error;
  }
  
  // Process the data to get summaries by category
  const incomeByCategory: Record<string, number> = {};
  const expensesByCategory: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
    } else {
      expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    }
  });
  
  // Calculate totals
  const totalIncome = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  return {
    transactions,
    summary: {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      incomeByCategory,
      expensesByCategory
    },
    period: {
      year,
      month,
      startDate,
      endDate
    }
  };
};
