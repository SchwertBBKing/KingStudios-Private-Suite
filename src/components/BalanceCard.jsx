import React from "react";
import WalletCard from "./WalletCard";

export default function BalanceCard({ balance = 0, transactions = [] }) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  // Income / Expenses
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, t) => a + Math.abs(Number(t.amount)), 0);

  const savingsRate = income ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0;

  const safeBalance = Number(balance) || 0;

  // Monthly Cashflow
  const now = new Date();
  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const monthlyCashflow = monthlyTransactions.reduce((a, t) => a + Number(t.amount), 0);

  return (
    <div className="rounded-2xl p-8 card">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Balance Info */}
        <div>
          <p className="text-sm text-gray-400/70 tracking-widest uppercase">Balance</p>
          <h2 className="text-5xl font-semibold text-gold drop-shadow-lg mt-3">
            {formatter.format(safeBalance)}
          </h2>

          <p
            className={`text-sm mt-3 ${
              monthlyCashflow >= 0 ? "text-emerald-300" : "text-gold"
            }`}
          >
            {monthlyCashflow >= 0 ? "+" : "-"} {formatter.format(Math.abs(monthlyCashflow))} this month
          </p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="stat-pill bg-richBlack/20 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase">Income</div>
              <div className="text-lg font-semibold text-emerald-300">{formatter.format(income)}</div>
            </div>
            <div className="stat-pill bg-richBlack/20 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase">Expenses</div>
              <div className="text-lg font-semibold text-gold">{formatter.format(expenses)}</div>
            </div>
            <div className="stat-pill bg-richBlack/20 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase">Savings Rate</div>
              <div className="text-lg font-semibold text-white">{savingsRate}%</div>
            </div>
            <div className="stat-pill bg-richBlack/20 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase">VIP Status</div>
              <div className="text-lg font-semibold text-gold">Platinum</div>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="justify-self-start lg:justify-self-end">
          <WalletCard
            balance={safeBalance}
            income={income}
            expenses={expenses}
            savingsRate={savingsRate}
            transactions={transactions}
            monthlyCashflow={monthlyCashflow}
          />
        </div>
      </div>
    </div>
  );
}