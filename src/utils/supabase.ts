import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables or use the provided ones
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jsbugsfpgazasmfwjqlp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYnVnc2ZwZ2F6YXNtZndqcWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTgzNjEsImV4cCI6MjA1ODE3NDM2MX0.1NlI5kdGDzY4C9Xabc1JWR0_u1p_IsSnrZYygaNhfjg';

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
  // Set default subscription dates if not provided
  const studentData = { ...student };
  
  // For new monthly or weekly subscriptions, set default start/end dates if not provided
  if ((studentData.subscription_type === 'monthly' || studentData.subscription_type === 'weekly') && 
      !studentData.subscription_start_date) {
    const startDate = new Date();
    studentData.subscription_start_date = startDate;
    
    // Set default end date based on subscription type
    if (!studentData.subscription_end_date) {
      const endDate = new Date(startDate);
      if (studentData.subscription_type === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (studentData.subscription_type === 'weekly') {
        endDate.setDate(endDate.getDate() + 7);
      }
      studentData.subscription_end_date = endDate;
    }
  }
  
  const { data, error } = await supabase
    .from('students')
    .insert(studentData)
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

// Get expiring student subscriptions
export const getExpiringSubscriptions = async (daysThreshold = 7) => {
  try {
    const { data, error } = await supabase
      .rpc('get_expiring_subscriptions', { days_threshold: daysThreshold });
    
    if (error) {
      console.error('Error fetching expiring subscriptions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching expiring subscriptions:', error);
    throw error;
  }
};

// Calculate student subscription status
export const calculateSubscriptionStatus = (student: any) => {
  if (!student) return 'unknown';
  
  if (student.subscription_type === 'per_session') {
    if (student.sessions_remaining <= 0) {
      return 'expired';
    } else if (student.sessions_remaining <= 2) {
      return 'warning';
    } else {
      return 'active';
    }
  }
  
  if (!student.subscription_end_date) return 'unknown';
  
  const endDate = new Date(student.subscription_end_date);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining < 0) {
    return 'expired';
  } else if (daysRemaining <= 5) {
    return 'warning';
  } else {
    return 'active';
  }
};

// Renew student subscription
export const renewStudentSubscription = async (studentId: string, paymentAmount: number) => {
  try {
    // Get the student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (studentError) {
      console.error(`Error fetching student with ID ${studentId}:`, studentError);
      throw studentError;
    }
    
    // Calculate new subscription dates
    const now = new Date();
    let newStartDate = now;
    let newEndDate = new Date(now);
    
    // Use current end date as start date if it's in the future
    if (student.subscription_end_date && new Date(student.subscription_end_date) > now) {
      newStartDate = new Date(student.subscription_end_date);
      newEndDate = new Date(student.subscription_end_date);
    }
    
    // Calculate new end date based on subscription type
    if (student.subscription_type === 'monthly') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (student.subscription_type === 'weekly') {
      newEndDate.setDate(newEndDate.getDate() + 7);
    } else if (student.subscription_type === 'course') {
      // For courses, assume it's a fixed duration set by the admin
      // You might want to add a 'course_duration_days' field to the student record
      const courseDuration = 30; // Default to 30 days
      newEndDate.setDate(newEndDate.getDate() + courseDuration);
    }
    
    // Create a transaction record
    const transaction = {
      type: 'income',
      category: 'subscription',
      amount: paymentAmount,
      description: `تجديد اشتراك - ${student.name}`,
      date: now,
      student_id: studentId,
      teacher_id: student.teacher_id
    };
    
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transaction);
    
    if (transactionError) {
      console.error('Error creating renewal transaction:', transactionError);
      throw transactionError;
    }
    
    // Update the student record
    const updates = {
      last_payment_date: now,
      active: true
    };
    
    // Only update dates for time-based subscriptions
    if (student.subscription_type !== 'per_session') {
      updates.subscription_start_date = newStartDate;
      updates.subscription_end_date = newEndDate;
    } else {
      // For per-session, add to the sessions count
      const sessionsAdded = Math.floor(paymentAmount / student.subscription_fee);
      updates.sessions_remaining = (student.sessions_remaining || 0) + sessionsAdded;
    }
    
    const { error: updateError } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId);
    
    if (updateError) {
      console.error(`Error updating student with ID ${studentId}:`, updateError);
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error renewing subscription:', error);
    throw error;
  }
};

// Get teacher earnings per student (for real-time tracking)
export const getTeacherEarningsPerStudent = async (teacherId: string) => {
  const { data: students, error } = await supabase
    .from('students')
    .select('id, name, subscription_fee, subscription_type, subscription_end_date, sessions_remaining')
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
  
  // Get last payment to this teacher
  const { data: lastPayment, error: paymentError } = await supabase
    .from('transactions')
    .select('amount, date')
    .eq('teacher_id', teacherId)
    .eq('type', 'expense')
    .eq('category', 'teacher_payout')
    .order('date', { ascending: false })
    .limit(1);
  
  if (paymentError) {
    console.error(`Error fetching last payment for teacher ${teacherId}:`, paymentError);
  }
  
  // Calculate earnings for each student with subscription status
  const earningsData = students.map(student => {
    // Calculate subscription status
    const status = calculateSubscriptionStatus(student);
    
    // Calculate teacher's earnings from this student
    const earningsPerStudent = Math.round((student.subscription_fee * teacher.percentage) / 100);
    
    return {
      student_id: student.id,
      student_name: student.name,
      subscription_fee: student.subscription_fee,
      subscription_type: student.subscription_type,
      subscription_status: status,
      teacher_earnings: earningsPerStudent,
      is_active: status !== 'expired'
    };
  });
  
  // Calculate total current earnings only from active students
  const totalCurrentEarnings = earningsData.reduce((sum, student) => {
    return sum + (student.is_active ? student.teacher_earnings : 0);
  }, 0);
  
  // Calculate last payment details
  const lastPaymentDetails = lastPayment && lastPayment.length > 0 
    ? {
        amount: lastPayment[0].amount,
        date: lastPayment[0].date
      }
    : null;
  
  return {
    students: earningsData,
    totalEarnings: totalCurrentEarnings,
    lastPayment: lastPaymentDetails
  };
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
    
    // If this is a student payment, update their last payment date and subscription
    if (transaction.type === 'income' && transaction.student_id) {
      await updateStudentAfterPayment(transaction.student_id, transaction.amount);
    }
    
    // If this is a teacher payout, record it
    if (transaction.type === 'expense' && transaction.category === 'teacher_payout' && transaction.teacher_id) {
      // No additional actions needed, the transaction record is sufficient
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Helper function to update student after payment
const updateStudentAfterPayment = async (studentId: string, amount: number) => {
  try {
    // Get the student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (studentError) {
      console.error(`Error fetching student with ID ${studentId}:`, studentError);
      throw studentError;
    }
    
    const updates = {
      last_payment_date: new Date(),
      active: true
    };
    
    // For per-session subscriptions, update the sessions count
    if (student.subscription_type === 'per_session') {
      const sessionsAdded = Math.floor(amount / student.subscription_fee);
      updates.sessions_remaining = (student.sessions_remaining || 0) + sessionsAdded;
    } else {
      // For time-based subscriptions, extend the end date
      
      // If end date is in the past or not set, start from today
      const baseDate = (student.subscription_end_date && new Date(student.subscription_end_date) > new Date())
        ? new Date(student.subscription_end_date)
        : new Date();
      
      // Calculate new end date based on subscription type and payment amount
      const renewalPeriods = Math.floor(amount / student.subscription_fee);
      const newEndDate = new Date(baseDate);
      
      if (student.subscription_type === 'monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + renewalPeriods);
      } else if (student.subscription_type === 'weekly') {
        newEndDate.setDate(newEndDate.getDate() + (7 * renewalPeriods));
      } else if (student.subscription_type === 'course') {
        // For courses, assume it's a fixed duration set by the admin
        const courseDuration = 30; // Default to 30 days
        newEndDate.setDate(newEndDate.getDate() + courseDuration);
      }
      
      updates.subscription_end_date = newEndDate;
      
      // If start date is not set or is in the future, set it to today
      if (!student.subscription_start_date || new Date(student.subscription_start_date) > new Date()) {
        updates.subscription_start_date = new Date();
      }
    }
    
    // Update the student record
    const { error: updateError } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId);
    
    if (updateError) {
      console.error(`Error updating student with ID ${studentId} after payment:`, updateError);
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating student after payment:', error);
    throw error;
  }
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
      // Get teacher's earnings data
      const earningsData = await getTeacherEarningsPerStudent(teacher.id);
      
      teacherEarnings.push({
        id: teacher.id,
        name: teacher.name,
        potentialEarnings: earningsData.totalEarnings,
        studentCount: earningsData.students.length,
        lastPayment: earningsData.lastPayment
      });
    }
  }

  // Get subscription status statistics
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, subscription_type, subscription_end_date, sessions_remaining')
    .eq('active', true);
  
  if (studentsError) {
    console.error('Error fetching students for subscription status:', studentsError);
  }
  
  const subscriptionStats = {
    active: 0,
    warning: 0,
    expired: 0
  };
  
  if (students) {
    students.forEach(student => {
      const status = calculateSubscriptionStatus(student);
      subscriptionStats[status] = (subscriptionStats[status] || 0) + 1;
    });
  }

  // Get expiring subscriptions
  const expiringSubscriptions = await getExpiringSubscriptions(7);

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
    subscriptionStats: subscriptionStats,
    expiringSubscriptions: expiringSubscriptions || [],
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
