import React from 'react';

interface Transaction {
  id: number;
  date: string;
  name: string;
  amount: number;
  type: string;
  category: string;
  currency?: string; // Currency is now optional
}

interface TransactionTableProps {
  transactions: Transaction[];
  editId: number | null;
  editData: Partial<Transaction>;
  setEditId: (id: number | null) => void;
  setEditData: (data: Partial<Transaction>) => void;
  handleEdit: (id: number, updated: Partial<Transaction>) => void;
  handleDelete: (id: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  editId,
  editData,
  setEditId,
  setEditData,
  handleEdit,
  handleDelete,
}) => (
  <>
    {/* Transactions Table */}
    {transactions.length === 0 ? (
      <p>No transactions found.</p>
    ) : (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              {editId === tx.id ? (
                <>
                  <td className="border p-2">
                    <input
                      type="date"
                      value={editData.date || tx.date}
                      onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      value={editData.name || tx.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={editData.amount || tx.amount}
                      onChange={(e) =>
                        setEditData({ ...editData, amount: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      value={editData.type || tx.type}
                      onChange={(e) =>
                        setEditData({ ...editData, type: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      value={editData.category || tx.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      className="mr-2 text-blue-600"
                      onClick={() => {
                        handleEdit(tx.id, editData);
                        setEditId(null);
                        setEditData({});
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-600"
                      onClick={() => {
                        setEditId(null);
                        setEditData({});
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{tx.date}</td>
                  <td className="border p-2">{tx.name}</td>
                  <td className="border p-2">
                    {tx.amount.toLocaleString(undefined, {
                      style: 'currency',
                      currency: tx.currency || '???', // Use currency from the database or default to USD
                    })}
                  </td>
                  <td className="border p-2">{tx.type}</td>
                  <td className="border p-2">{tx.category}</td>
                  <td className="border p-2">
                    <button
                      className="mr-2 text-blue-600"
                      onClick={() => {
                        setEditId(tx.id);
                        setEditData(tx);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(tx.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
);

export default TransactionTable;