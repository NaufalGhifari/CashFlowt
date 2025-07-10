import Papa from 'papaparse';
import type { ParseError } from 'papaparse';
import { supabase } from '@/lib/supaBaseClient';
import { useState } from 'react';

function parseDDMMYYYY(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date().toISOString().slice(0, 10);

  let [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return new Date().toISOString().slice(0, 10);

  // If year is 2-digit, fix to 20xx (or your preferred pivot)
  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }

  const dateObj = new Date(year, month - 1, day);

  return dateObj.toISOString().slice(0, 10);
}

export default function CSVImport({ userId, onImport }: { userId: string; onImport: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type CSVRow = {
    [key: string]: string | undefined;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results:Papa.ParseResult<CSVRow>) => {
        const rows = results.data as any[];

        // Normalize headers to lowercase
        const cleanedRows = rows.map((row) => {
          const normalized: Record<string, any> = {};
          Object.keys(row).forEach((key) => {
            normalized[key.trim().toLowerCase()] = row[key];
          });
          return normalized;
        });

        // Filter out rows missing required fields
        const validRows = cleanedRows
          .filter((row) => row.name && row.amount)
          .map((row) => ({
            user_id: userId,
            name: row.name,
            amount: parseFloat(row.amount),
            date: row.date ? parseDDMMYYYY(row.date) : new Date().toISOString().slice(0, 10),
            type: row.type || 'expense',
            category: row.category || '',
            description: row.description || '',
            status: row.status || 'cleared',
            currency: row.currency || 'IDR',
          }));

        if (validRows.length === 0) {
          setError('No valid rows found (must have at least name and amount).');
          setLoading(false);
          return;
        }

        const { error } = await supabase.from('transactions').insert(validRows);

        if (error) {
          console.error('Error inserting:', error);
          setError(error.message);
        } else {
          onImport();
        }

        setLoading(false);
      },
      error: (err: ParseError) => {
        console.error('Parse error:', err);
        setError(err.message);
        setLoading(false);
      },
    });
  };

  return (
    <div className="mb-8 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Import CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2"
      />
      {loading && <p>Importing...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
