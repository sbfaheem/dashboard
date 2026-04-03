import { createMonthlyReport, addFixedExpense, addVariableExpense, fetchAllReports, fetchMonthlyReport, deleteExpense, deleteMonthlyReport } from "../actions";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }) {
  const params = await searchParams;
  const reports = await fetchAllReports();
  const activeReportId = params?.report_id || (reports.length > 0 ? reports[reports.length - 1].id : null);
  
  const activeReportDetails = activeReportId ? await fetchMonthlyReport(reports.find(r => r.id === activeReportId)?.month_year) : null;

  async function handleCreateReport(formData) {
    "use server";
    await createMonthlyReport(formData);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function handleFixedExpense(formData) {
    "use server";
    await addFixedExpense(formData);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function handleVariableExpense(formData) {
    "use server";
    await addVariableExpense(formData);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function handleDeleteExpense(formData) {
    "use server";
    const id = formData.get('id');
    const table = formData.get('table');
    await deleteExpense(table, id);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <header className="flex items-center justify-between border-b border-primary/20 bg-white dark:bg-background-dark px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 text-primary dark:text-accent">
          <span className="material-symbols-outlined text-3xl">account_balance</span>
          <h2 className="text-xl font-bold tracking-tight">FinDash Admin</h2>
        </div>
        <div className="flex gap-4">
          <form method="GET" action="/admin" className="flex items-center gap-2">
            <span className="text-sm font-semibold">Active Month:</span>
            <select name="report_id" onChange="" className="form-select text-sm rounded-lg border-primary/20 bg-white dark:bg-slate-800" defaultValue={activeReportId || ""}>
              <option disabled value="">Select a Month</option>
              {reports.map(r => <option key={r.id} value={r.id}>{r.month_year}</option>)}
            </select>
            <button type="submit" className="bg-primary/10 text-primary px-3 py-1.5 rounded text-sm font-bold">Select</button>
          </form>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
            <h3 className="text-lg font-bold flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-primary dark:text-accent">add_circle</span>
              Initialize New Month
            </h3>
            <form action={handleCreateReport} className="flex flex-col gap-5">
               <div className="flex gap-4">
                <label className="flex flex-col gap-2 flex-grow">
                  <span className="text-sm font-semibold">Month / Year</span>
                  <input name="monthYear" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="text" placeholder="2026-04" />
                </label>
              </div>
              <div className="flex gap-4">
                <label className="flex flex-col gap-2 flex-grow">
                  <span className="text-sm font-semibold">Opening Balance</span>
                  <input name="openingBalance" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="number" placeholder="50400" />
                </label>
                <label className="flex flex-col gap-2 flex-grow">
                  <span className="text-sm font-semibold">Collection</span>
                  <input name="monthlyCollection" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="number" placeholder="284750" />
                </label>
              </div>
              <button type="submit" className="mt-2 bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">Create Month</button>
            </form>
          </div>

          {activeReportId && activeReportDetails ? (
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
                <h3 className="text-lg font-bold pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 flex justify-between">Add Fixed Expense <span className="text-primary text-sm bg-primary/10 px-2 py-1 rounded">{activeReportDetails.month_year}</span></h3>
                <form action={handleFixedExpense} className="flex flex-col gap-5">
                  <input type="hidden" name="reportId" value={activeReportId} />
                  <div className="flex gap-4">
                    <label className="flex flex-col gap-2 flex-grow">
                      <span className="text-sm font-semibold">Description</span>
                      <input name="description" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="text" placeholder="Security Expense" />
                    </label>
                    <label className="flex flex-col gap-2 w-32">
                      <span className="text-sm font-semibold">Amount</span>
                      <input name="amount" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="number" placeholder="20000" />
                    </label>
                  </div>
                  <button type="submit" className="bg-primary/10 text-primary py-2.5 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">Add</button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
                <h3 className="text-lg font-bold pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">Add Variable Expense</h3>
                <form action={handleVariableExpense} className="flex flex-col gap-5">
                  <input type="hidden" name="reportId" value={activeReportId} />
                  <div className="flex gap-4">
                    <label className="flex flex-col gap-2 flex-grow">
                      <span className="text-sm font-semibold">Description</span>
                      <input name="description" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="text" placeholder="Gutter Cleaned" />
                    </label>
                    <label className="flex flex-col gap-2 w-32">
                      <span className="text-sm font-semibold">Amount</span>
                      <input name="amount" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="number" placeholder="5000" />
                    </label>
                  </div>
                  <button type="submit" className="bg-secondary-gold/20 text-secondary-gold py-2.5 rounded-lg font-bold hover:bg-secondary-gold hover:text-white transition-colors">Add</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center p-10 text-slate-500">
              Select or Create a month to manage its expenses.
            </div>
          )}
        </div>

        {activeReportDetails && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 overflow-hidden mb-12">
            <h3 className="text-lg font-bold p-6 border-b border-slate-100 dark:border-slate-700 bg-primary/5">Recorded Expenses for {activeReportDetails.month_year}</h3>
            <div className="overflow-x-auto p-6">
              <table className="w-full text-left">
                <thead className="text-xs font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {activeReportDetails.fixedExpenses.map(exp => (
                    <tr key={`f-${exp.id}`}>
                      <td className="px-4 py-3"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">FIXED</span></td>
                      <td className="px-4 py-3 font-medium">{exp.description}</td>
                      <td className="px-4 py-3 text-slate-500">{exp.amount}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={handleDeleteExpense}>
                          <input type="hidden" name="table" value="fixed_expenses" />
                          <input type="hidden" name="id" value={exp.id} />
                          <button className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 px-2 py-1 rounded">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {activeReportDetails.variableExpenses.map(exp => (
                    <tr key={`v-${exp.id}`}>
                      <td className="px-4 py-3"><span className="text-xs bg-secondary-gold/10 text-secondary-gold px-2 py-1 rounded">VARIABLE</span></td>
                      <td className="px-4 py-3 font-medium">{exp.description}</td>
                      <td className="px-4 py-3 text-slate-500">{exp.amount}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={handleDeleteExpense}>
                          <input type="hidden" name="table" value="variable_expenses" />
                          <input type="hidden" name="id" value={exp.id} />
                          <button className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 px-2 py-1 rounded">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {activeReportDetails.fixedExpenses.length === 0 && activeReportDetails.variableExpenses.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-4 text-slate-400">No expenses recorded for this month yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
