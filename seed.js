const { createClient } = require('@supabase/supabase-js');

// We use the variables right from your configuration
const supabaseUrl = 'https://ipppgxbvdzwnsqbcwgct.supabase.co';
const supabaseKey = 'sb_publishable_BGul8mjcMaidXDeWNoD4Jg_JYc6uByX';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMarchData() {
  console.log("Seeding Database Start...");

  // 1. Insert the Monthly Report for March
  const { data: reportData, error: reportError } = await supabase
    .from('monthly_reports')
    .insert([
      {
        month_year: "2026-03",
        opening_balance: 32830,
        monthly_collection: 283250
      }
    ])
    .select()
    .single();

  if (reportError) {
    if (reportError.code === '23505') {
       console.log("March 2026 Report already exists in the database. Deleting and re-seeding...");
       // Delete if exists and try again
       await supabase.from('monthly_reports').delete().eq('month_year', '2026-03');
       return seedMarchData();
    }
    console.error("Error creating report:", reportError);
    return;
  }

  const reportId = reportData.id;
  console.log('✅ Created March 2026 Report Row with UUID:', reportId);

  // 2. Insert Fixed Expenses
  const fixedExpenses = [
    { report_id: reportId, description: "Security Expense", amount: 210000 },
    { report_id: reportId, description: "Electrician Charges", amount: 8000 },
    { report_id: reportId, description: "Sweeper Salary", amount: 20000 },
    { report_id: reportId, description: "Sweeper Accessories", amount: 6200 },
    { report_id: reportId, description: "Electrical Accessories", amount: 14765 },
    { report_id: reportId, description: "Park", amount: 3530 },
  ];

  const { error: fixedError } = await supabase.from('fixed_expenses').insert(fixedExpenses);
  if (fixedError) {
    console.error("Error creating fixed expenses:", fixedError);
  } else {
    console.log('✅ Inserted all Fixed Expenses.');
  }

  // 3. Insert Variable Expenses
  const variableExpenses = [
    { report_id: reportId, description: "Miscellaneous Expenses", amount: 6800 },
    { report_id: reportId, description: "Gutter Cleaned", amount: 5000 },
  ];

  const { error: variableError } = await supabase.from('variable_expenses').insert(variableExpenses);
  if (variableError) {
    console.error("Error creating variable expenses:", variableError);
  } else {
    console.log('✅ Inserted all Variable Expenses.');
  }

  console.log("--------------");
  console.log("🎉 Database Successfully Seeded! Go reload your Vercel URL!");
}

seedMarchData();
