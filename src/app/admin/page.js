import { createMonthlyReport, addFixedExpense, addVariableExpense } from "../actions";
import { revalidatePath } from "next/cache";

export default function AdminDashboard() {

  // Server Action wrappers that trigger page reloads upon success
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

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <header className="flex items-center justify-between border-b border-primary/20 bg-white dark:bg-background-dark px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 text-primary dark:text-accent">
          <span className="material-symbols-outlined text-3xl">account_balance</span>
          <h2 className="text-xl font-bold tracking-tight">FinDash Admin</h2>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-primary/10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Data Entry Control Center</h1>
            <p className="text-slate-500 text-sm">Manage system expenses. Make sure to create a month first, then add its expenses based on its Month/Year string exactly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Report Block */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
            <h3 className="text-lg font-bold flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-primary dark:text-accent">add_circle</span>
              Initialize New Month
            </h3>
            <form action={handleCreateReport} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Month / Year (e.g. 2026-03)</span>
                <input name="monthYear" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900 dark:text-white" type="text" placeholder="2026-03" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Opening Balance (PKR)</span>
                <input name="openingBalance" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900 dark:text-white" type="number" placeholder="e.g. 50400" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Monthly Collection (PKR)</span>
                <input name="monthlyCollection" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900 dark:text-white" type="number" placeholder="284750" />
              </label>
              <button type="submit" className="mt-2 bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
                Create Month
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            {/* Add Fixed Expense Block */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
              <h3 className="text-lg font-bold pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">Add Fixed Operational Expense</h3>
              <form action={handleFixedExpense} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Target Report UUID</span>
                  <input name="reportId" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="text" placeholder="UUID of the Month" />
                </label>
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
                <button type="submit" className="bg-primary/10 text-primary py-2.5 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">Add Fixed Expense</button>
              </form>
            </div>

            {/* Add Variable Expense Block */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 p-6 flex flex-col h-fit">
              <h3 className="text-lg font-bold pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">Add Variable / Miscellaneous Expense</h3>
              <form action={handleVariableExpense} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Target Report UUID</span>
                  <input name="reportId" required className="form-input rounded-lg border-primary/20 dark:bg-slate-900" type="text" placeholder="UUID of the Month" />
                </label>
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
                <button type="submit" className="bg-secondary-gold/20 text-secondary-gold py-2.5 rounded-lg font-bold hover:bg-secondary-gold hover:text-white transition-colors">Add Variable Expense</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
