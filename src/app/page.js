import { fetchMonthlyReport } from "../../actions";

export default async function Home() {
  // Try to load the March 2026 report
  let report = await fetchMonthlyReport("2026-03").catch(() => null);

  // If DB not setup or report not created, use placeholders matching original sheet
  if (!report) {
    report = {
      month_year: "2026-03",
      opening_balance: 32830,
      monthly_collection: 283250,
      fixedExpenses: [
        { id: 1, description: "Security Expense", amount: 210000 },
        { id: 2, description: "Electrician Charges", amount: 8000 },
        { id: 3, description: "Sweeper Salary", amount: 20000 },
        { id: 4, description: "Sweeper Accessories", amount: 6200 },
        { id: 5, description: "Electrical Accessories", amount: 14765 },
        { id: 6, description: "Park", amount: 3530 },
      ],
      variableExpenses: [
        { id: 7, description: "Miscellaneous Expenses", amount: 6800 },
        { id: 8, description: "Gutter Cleaned", amount: 5000 },
      ]
    }
  }

  const formatPKR = (num) => num.toLocaleString('en-US');

  const totalFixed = report.fixedExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalVariable = report.variableExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  
  const totalExpense = totalFixed + totalVariable;
  const saving = Number(report.monthly_collection) - totalExpense;
  const totalSaving = Number(report.opening_balance) + saving;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">ExpensePro</h2>
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">Viewer Mode</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm text-primary">visibility</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Read-only Access</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" title="Export CSV">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
              MONTHLY EXPENSE SHEET 
              <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{report.month_year}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium pt-2">Detailed financial overview for the current billing cycle. UUID: {report.id || 'N/A'}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Opening Balance</span>
              <span className="material-symbols-outlined text-slate-400">account_balance</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{formatPKR(report.opening_balance)}</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-l-orange-500 border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Collection</span>
              <span className="material-symbols-outlined text-orange-500">payments</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{formatPKR(report.monthly_collection)}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-l-primary border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Expense</span>
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{formatPKR(totalExpense)}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-l-green-500 border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saving</span>
              <span className="material-symbols-outlined text-green-500">savings</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{formatPKR(saving)}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-l-secondary-gold border border-primary/10 shadow-sm flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Saving</span>
              <span className="material-symbols-outlined text-secondary-gold">account_balance_wallet</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{formatPKR(totalSaving)}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                <h3 className="font-bold">Operational Expenses</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase">Fixed Expenses</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {report.fixedExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{exp.description}</td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{formatPKR(Number(exp.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="px-6 py-4 bg-secondary-gold/10 border-b border-secondary-gold/20 flex items-center justify-between">
                <h3 className="font-bold">Miscellaneous Expenses</h3>
                <span className="text-xs bg-secondary-gold/20 text-secondary-gold px-2 py-1 rounded font-bold uppercase">Variable Expenes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                     {report.variableExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-purple-600 dark:text-purple-400">{exp.description}</td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{formatPKR(Number(exp.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/20">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">notes</span> Notes
              </h4>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-right mb-6" dir="rtl">
                نوٹ: یہ اطلاع دی جاتی ہے کہ اس ماہ کی کلیکشن میں کمی اس لیے آئی ہے کیونکہ کچھ افراد نے اپنی ماہانہ رقم ادا نہیں کی، جس کی وجہ سے مجموعی کلیکشن اور سیونگ متاثر ہوئی ہے۔ براہ کرم آئندہ وقت پر ادائیگی یقینی بنائیں۔ شکریہ۔
              </p>
              
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2 border-t border-primary/20 pt-4">
                <span className="material-symbols-outlined">contact_support</span> Point of Contact
              </h4>
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">For any questions or clarifications regarding this financial summary, please contact:</p>
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                    <span>Mr. Majeed Shb</span>
                    <span className="text-primary">0301-3377675</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                    <span>Mr. Fahad Rizwan</span>
                    <span className="text-primary">0344-3160446</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-background-dark border-t border-primary/10 py-6 text-center text-slate-400 text-xs">
        <p>© 2026 Expense Management System. Generated securely.</p>
      </footer>
    </div>
  );
}
