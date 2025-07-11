'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          CashFlowt
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/dashboard" className="font-semibold">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/ledger" className="font-semibold">
              Ledger
            </Link>
          </li>
          <li>
            <Link href="/login" className="font-semibold">
              Sign Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
