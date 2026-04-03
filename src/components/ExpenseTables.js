"use client";

import { useState } from 'react';

export default function ExpenseTables({ fixedExpenses, variableExpenses }) {
  const [searchTerm, setSearchTerm] = useState('');

  const formatPKR = (num) => num.toLocaleString('en-US');

  const filterExpenses = (expenses) => 
    expenses.filter((exp) => 
      exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredFixed = filterExpenses(fixedExpenses);
  const filteredVariable = filterExpenses(variableExpenses);

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-primary/10 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h3 className="font-bold text-lg">Search Transactions</h3>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search by description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primary/20 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

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
              {filteredFixed.length > 0 ? filteredFixed.map((exp) => (
                <tr key={exp.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{exp.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right">{formatPKR(Number(exp.amount))}</td>
                </tr>
              )) : (
                <tr><td colSpan="2" className="px-6 py-4 text-center text-sm text-slate-500">No matching fixed expenses</td></tr>
              )}
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
                {filteredVariable.length > 0 ? filteredVariable.map((exp) => (
                <tr key={exp.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-purple-600 dark:text-purple-400">{exp.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right">{formatPKR(Number(exp.amount))}</td>
                </tr>
              )) : (
                <tr><td colSpan="2" className="px-6 py-4 text-center text-sm text-slate-500">No matching variable expenses</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
