'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supaBaseClient';
import { useRouter } from 'next/navigation';
import ExpensesChart from '../../components/ExpensesCharts';

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

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  return (
    <div className="p-8" style={{ marginLeft: '10%', marginRight: '10%' }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Summary</h1>
      <h2 className="text-center">Your expenses, visualised. 👀</h2>
      
      {/* Line chart */}
      <ExpensesChart transactions={transactions} />
    </div>
  );
}
