import React, { useState } from 'react';

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
}) => {
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    type: '',
    category: '', // Changed from description to category
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesMonth = filters.month
      ? tx.date.includes(`-${filters.month.padStart(2, '0')}-`)
      : true;
    const matchesYear = filters.year ? tx.date.startsWith(filters.year) : true;
    const matchesType = filters.type ? tx.type === filters.type : true;
    const matchesCategory = filters.category // Updated logic to filter by category
      ? tx.category.toLowerCase().includes(filters.category.toLowerCase())
      : true;

    return matchesMonth && matchesYear && matchesType && matchesCategory;
  });

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Month</span>
          </label>
          <input
            type="text"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            placeholder="MM"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Year</span>
          </label>
          <input
            type="text"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            placeholder="YYYY"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <input
            type="text"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            placeholder="Type"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            placeholder="Category"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto" style={{ marginLeft: '10%', marginRight: '10%' }}>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  {editId === tx.id ? (
                    <>
                      <td>
                        <input
                          type="date"
                          value={editData.date || tx.date}
                          onChange={(e) =>
                            setEditData({ ...editData, date: e.target.value })
                          }
                          className="input input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          value={editData.name || tx.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="input input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.amount || tx.amount}
                          onChange={(e) =>
                            setEditData({ ...editData, amount: Number(e.target.value) })
                          }
                          className="input input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          value={editData.type || tx.type}
                          onChange={(e) =>
                            setEditData({ ...editData, type: e.target.value })
                          }
                          className="input input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          value={editData.category || tx.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                          className="input input-bordered"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => {
                            handleEdit(tx.id, editData);
                            setEditId(null);
                            setEditData({});
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm ml-2"
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
                      <td>{tx.date}</td>
                      <td>{tx.name}</td>
                      <td>
                        {tx.amount.toLocaleString(undefined, {
                          style: 'currency',
                          currency: tx.currency || '???',
                        })}
                      </td>
                      <td>{tx.type}</td>
                      <td>{tx.category}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => {
                            setEditId(tx.id);
                            setEditData(tx);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-error btn-sm ml-2"
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
        </div>
      )}
    </>
  );
};

export default TransactionTable;