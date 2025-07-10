import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supaBaseClient';
import { useRouter } from 'next/router';
import TransactionForm from '@/components/TransactionForm';
import CSVImport from '@/components/CSVImport';
import TransactionTable from '@/components/TransactionTable';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check session and fetch user on mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };

    getSession();
  }, [router]);

  // Fetch transactions when user is set
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }); // Ensure descending order by date

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions((data || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  // Edit transaction handler
  const handleEdit = async (id: number, updated: any) => {
    setLoading(true);
    const { error } = await supabase
      .from('transactions')
      .update(updated)
      .eq('id', id);
    if (error) {
      alert('Error updating transaction: ' + error.message);
    } else {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, ...updated } : tx))
      );
    }
    setLoading(false);
  };

  // Delete transaction handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    setLoading(true);
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Error deleting transaction: ' + error.message);
    } else {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    }
    setLoading(false);
  };

  // For editing state
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CashFlowt</h1>
    
      {/* New Transaction Form */}
      <TransactionForm userId={user.id} onAdd={() => router.reload()} />
    
      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        editId={editId}
        editData={editData}
        setEditId={setEditId}
        setEditData={setEditData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/*CSV Import*/}
      <CSVImport userId={user.id} onImport={() => router.reload()} />
    
      {/* Sign Out Button */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
