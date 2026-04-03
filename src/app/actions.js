'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchMonthlyReport(monthYear) {
  const { data: report, error } = await supabase
    .from('monthly_reports')
    .select('id, month_year, opening_balance, monthly_collection')
    .eq('month_year', monthYear)
    .single()
    
  if (error || !report) return null

  // Fetch standard/fixed
  const { data: fixedExpenses } = await supabase
    .from('fixed_expenses')
    .select('id, description, amount')
    .eq('report_id', report.id)

  const { data: variableExpenses } = await supabase
    .from('variable_expenses')
    .select('id, description, amount')
    .eq('report_id', report.id)

  return {
    ...report,
    fixedExpenses: fixedExpenses || [],
    variableExpenses: variableExpenses || []
  }
}

export async function createMonthlyReport(formData) {
  const monthYear = formData.get('monthYear')
  const openingBalance = parseFloat(formData.get('openingBalance'))
  const monthlyCollection = parseFloat(formData.get('monthlyCollection'))

  if (!monthYear || isNaN(openingBalance) || isNaN(monthlyCollection)) {
    throw new Error('Invalid input')
  }

  const { data, error } = await supabase
    .from('monthly_reports')
    .insert([
      { month_year: monthYear, opening_balance: openingBalance, monthly_collection: monthlyCollection }
    ])
    .select()

  if (error) throw error
  return data
}

export async function addFixedExpense(formData) {
  const reportId = formData.get('reportId')
  const description = formData.get('description')
  const amount = parseFloat(formData.get('amount'))

  const { data, error } = await supabase
    .from('fixed_expenses')
    .insert([{ report_id: reportId, description, amount }])
  if (error) throw error
  return data
}

export async function addVariableExpense(formData) {
  const reportId = formData.get('reportId')
  const description = formData.get('description')
  const amount = parseFloat(formData.get('amount'))

  const { data, error } = await supabase
    .from('variable_expenses')
    .insert([{ report_id: reportId, description, amount }])
  if (error) throw error
  return data
}

export async function deleteExpense(tableName, id) {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) throw new Error("Failed to delete expense");
}

export async function fetchAllReports() {
  const { data, error } = await supabase
    .from('monthly_reports')
    .select('id, month_year, opening_balance, monthly_collection')
    .order('month_year', { ascending: true });
    
  if (error) return [];
  return data || [];
}
