// src/components/TransactionForm.tsx
import { useState } from 'react';
import { supabase } from '../lib/supaBaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';    


export default function TransactionForm({ userId, onAdd }: { userId: string; onAdd: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today's date
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
      setDate(new Date().toISOString().split('T')[0]); // Reset to today's date
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
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-4 p-6 rounded-lg shadow-md bg-white border border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Transaction</h2>

      <Input
        type="date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <Input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="IDR">IDR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>

      <Input
        type="number"
        placeholder="Amount"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <Input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="cleared">Cleared</option>
        <option value="pending">Pending</option>
        <option value="refunded">Refunded</option>
      </select>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </Button>
    </form>
  );
}
