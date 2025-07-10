// src/components/TransactionForm.tsx

import { useState } from 'react';
import { supabase } from '@/lib/supaBaseClient';

export default function TransactionForm({ userId, onAdd }: { userId: string; onAdd: () => void }) {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('cleared');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('IDR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('transactions').insert([
      {
        user_id: userId,
        date,
        name,
        currency,
        amount: parseFloat(amount),
        type,
        category,
        description,
        status,
      },
    ]);

    if (error) {
      console.error('Error adding transaction:', error);
      alert(error.message);
    } else {
      // Clear form
      setDate('');
      setName('');
      setAmount('');
      setType('expense');
      setCategory('');
      setDescription('');
      setStatus('cleared');
      // Notify parent to refresh
      onAdd();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Add Transaction</h2>

      <input
        type="date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-2 py-1"
      />

      <input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1"
      />

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border px-2 py-1"
        >
        <option value="IDR">IDR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>   

      <input
        type="number"
        placeholder="Amount"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-2 py-1"
      />

      <select value={type} onChange={(e) => setType(e.target.value)} className="border px-2 py-1">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-2 py-1"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-2 py-1"
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1">
        <option value="cleared">Cleared</option>
        <option value="pending">Pending</option>
        <option value="refunded">Refunded</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}
