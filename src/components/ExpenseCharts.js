"use client";

import { PureComponent } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#006600', '#D4AF37']; // Primary and Accent Gold

export default function ExpenseCharts({ fixedTotal, variableTotal }) {
  const data = [
    { name: 'Fixed Expenses', value: fixedTotal },
    { name: 'Variable Expenses', value: variableTotal },
  ].filter(item => item.value > 0); // Don't show zeroes if they don't exist yet

  if (data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-primary/10 overflow-hidden p-6 mt-6">
      <h3 className="font-bold text-lg border-b border-primary/10 pb-4 mb-4">Category Distribution</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `PKR ${value.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
