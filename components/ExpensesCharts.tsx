'use client';

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ✅ Your transaction type
type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  name: string;
  category?: string; // Add category!
};

// ✅ Your main component
export default function ExpensesDashboard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Get unique months
  const months = useMemo(() => {
    const unique = new Set<string>();
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      unique.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return Array.from(unique).sort().reverse();
  }, [transactions]);

  // Auto-select latest
  useMemo(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  // 🔹 Group by day for line chart
  const lineData = useMemo(() => {
    if (!selectedMonth) return [];

    const grouped: Record<string, { date: string; total: number; transactions: Transaction[] }> = {};
    const [year, month] = selectedMonth.split("-");
    const days = new Date(+year, +month, 0).getDate();

    for (let d = 1; d <= days; d++) {
      const dayStr = `${String(d).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
      grouped[dayStr] = { date: dayStr, total: 0, transactions: [] };
    }

    transactions.filter(tx => tx.type === "expense").forEach((tx) => {
      const d = new Date(tx.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (m === selectedMonth) {
        const dayStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        grouped[dayStr].total += tx.amount;
        grouped[dayStr].transactions.push(tx);
      }
    });

    return Object.values(grouped);
  }, [transactions, selectedMonth]);

  // 🔹 Group by category for pie & table
  const categoryData = useMemo(() => {
    if (!selectedMonth) return [];

    const grouped: Record<string, number> = {};
    transactions.filter(tx => tx.type === "expense").forEach((tx) => {
      const d = new Date(tx.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (m === selectedMonth) {
        const cat = tx.category || "Uncategorized";
        grouped[cat] = (grouped[cat] || 0) + tx.amount;
      }
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions, selectedMonth]);

  // Calculate total spent for selected month
  const totalSpent = useMemo(() => {
    if (!selectedMonth) return 0;
    return transactions
      .filter(tx => tx.type === "expense")
      .filter(tx => {
        const d = new Date(tx.date);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return m === selectedMonth;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, selectedMonth]);

  const colors = [
    "#60a5fa", "#f472b6", "#34d399", "#facc15", "#f87171",
    "#a78bfa", "#fb923c", "#38bdf8", "#fbbf24", "#4ade80",
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const day = payload[0].payload;
      return (
        <div className="rounded bg-white p-2 shadow">
          <p className="font-semibold">{label}</p>
          {day.transactions.map((tx: Transaction) => (
            <div key={tx.id} className="text-sm">
              {tx.name}: Rp {tx.amount.toLocaleString()}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Total Spent */}
      <div className="text-center font-semibold mb-2"><h2>Total Spent: <span className="text-blue-600">IDR {totalSpent.toLocaleString("id-ID")}</span></h2></div>

      {/* Line Chart */}
      <div className="card bg-base-100 p-4 shadow">
        <h2 className="text-lg font-bold mb-2">Daily Expenses</h2>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-500">No data.</p>}
      </div>

      <div className="flex flex-row md:flex-row gap-6 w-full">
        {/* Pie Chart Card */}
        <div className="flex-1 min-w-0 bg-base-100 card shadow p-4">
          <h2 className="text-lg font-bold mb-2">Expenses by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500">No data.</p>}
        </div>

        {/* Table Card */}
        <div className="flex-1 min-w-0 bg-base-100 card shadow p-4">
          <h2 className="text-lg font-bold mb-2">Category Summary</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map(cat => (
                  <tr key={cat.name}>
                    <td>{cat.name}</td>
                    <td>Rp {cat.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
