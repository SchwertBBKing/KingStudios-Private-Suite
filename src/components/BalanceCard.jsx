import React from "react";
import WalletCard from "./WalletCard";

export default function BalanceCard({
  balance = 0,
  monthlyChange = 0,
  transactions = [],
}) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  const sorted = [...transactions].sort((a, b) => a.createdAt - b.createdAt);
  let cum = 0;
  const balances = sorted.map((t) => (cum += Number(t.amount)));
  const last = balances.slice(-12);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, b) => a + Number(b.amount), 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, b) => a + Math.abs(Number(b.amount)), 0);

  const savingsRate = income
    ? Math.max(0, Math.round(((income - expenses) / income) * 100))
    : 0;

  return (
    <div className="rounded-2xl p-8 card">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Balance Info */}
        <div>
          <p className="text-sm small-muted tracking-widest uppercase">
            Balance
          </p>
          <h2 className="text-5xl font-semibold text-gold mt-3 gold-glow">
            {formatter.format(balance)}
          </h2>
          <p
            className={`text-sm mt-3 ${
              monthlyChange >= 0 ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {monthlyChange >= 0 ? "+" : "-"}{" "}
            {formatter.format(Math.abs(monthlyChange))} this month
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="stat-pill">
              <div className="stat-label">Income</div>
              <div className="stat-value">{formatter.format(income)}</div>
            </div>
            <div className="stat-pill">
              <div className="stat-label">Expenses</div>
              <div className="stat-value">{formatter.format(expenses)}</div>
            </div>
            <div className="stat-pill">
              <div className="stat-label">Savings rate</div>
              <div className="stat-value">{savingsRate}%</div>
            </div>
            <div className="stat-pill">
              <div className="stat-label">VIP status</div>
              <div className="stat-value">Platinum</div>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="justify-self-start lg:justify-self-end">
          <WalletCard />
        </div>
      </div>
    </div>
  );
}