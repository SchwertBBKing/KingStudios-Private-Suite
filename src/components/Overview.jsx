import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import BalanceCard from "./BalanceCard";
import TransactionList from "./TransactionList";
import ModalAddTransaction from "./ModalAddTransaction";
import Toasts from "./Toast";

import { getAllTx, saveTx, deleteTx } from "../db";
import useFinance from "../hooks/useFinance";
import { formatCurrency, formatPercent } from "../utils/format";

const RECENT_LIMIT = 10;

export default function Overview({ balance, onAdd, onSearch, onExport }) {
  /* ---------------- State ---------------- */
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toasts, setToasts] = useState([]);

  /* ---------------- Load DB ---------------- */
  useEffect(() => {
    getAllTx().then((data) => {
      if (data.length === 0) {
        const seed = {
          id: Date.now(),
          name: "Initial Balance",
          amount: 10000,
          category: "Income",
          createdAt: Date.now(),
        };
        saveTx(seed);
        setTransactions([seed]);
      } else {
        setTransactions(data.sort((a, b) => b.createdAt - a.createdAt));
      }
    });
  }, []);

  const finance = useFinance(transactions);

  /* ---------------- Toast ---------------- */
  const toast = (text) => {
    const id = Date.now();
    setToasts((s) => [{ id, text }, ...s]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 3000);
  };

  /* ---------------- CRUD ---------------- */
  const saveTransaction = async (tx) => {
    const data = tx.id ? tx : { ...tx, id: Date.now(), createdAt: Date.now() };

    await saveTx(data);
    setTransactions((s) =>
      tx.id ? s.map((t) => (t.id === tx.id ? data : t)) : [data, ...s],
    );

    toast(tx.id ? "Transaction updated" : "Transaction added");
    setModalOpen(false);
    setEditing(null);
  };

  const removeTransaction = async (id) => {
    await deleteTx(id);
    setTransactions((s) => s.filter((t) => t.id !== id));
    toast("Transaction deleted");
  };

  /* ---------------- Derived ---------------- */
  const recentTransactions = useMemo(
    () => transactions.slice(0, RECENT_LIMIT),
    [transactions],
  );

  const categoryRows = useMemo(() => {
    const totals = finance.categoryTotals;
    const totalAbs = Object.values(totals).reduce((a, b) => a + Math.abs(b), 0);

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        share: totalAbs === 0 ? 0 : (Math.abs(amount) / totalAbs) * 100,
      }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  }, [finance.categoryTotals]);

  /* ---------------- Render ---------------- */
  return (
    <main className="flex-1 p-8 space-y-8 overflow-y-auto">
      {/* HEADER */}
      <Header
        balance={finance.balance}
        onAdd={() => setModalOpen(true)}
        onSearch={(v) => console.log(v)}
        onExport={() => console.log("export")}
        studio="KingStudios"
      />

      {/* TOP: Balance + Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BalanceCard
            balance={formatCurrency(finance.balance)}
            income={formatCurrency(finance.incomeThisMonth)}
            expenses={formatCurrency(finance.expensesThisMonth)}
            cashflow={formatCurrency(finance.cashflowThisMonth)}
            monthlyChange={formatPercent(finance.monthlyChange)}
          />
        </div>

        <div className="md:col-span-1">
          <div className="stat-card h-full flex flex-col">

            <div className="flex-1">
              <TransactionList
                transactions={recentTransactions}
                compact
                onEdit={(tx) => {
                  setEditing(tx);
                  setModalOpen(true);
                }}
                onDelete={removeTransaction}
              />
            </div>

            {transactions.length > RECENT_LIMIT && (
              <div className="text-sm text-gray-400 mt-2 text-right">
                View all transactions →
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI ROW */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-head">Income (Month)</div>
          <div className="stat-kpi text-green-400">
            {formatCurrency(finance.incomeThisMonth)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Expenses (Month)</div>
          <div className="stat-kpi text-red-400">
            {formatCurrency(finance.expensesThisMonth)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Cashflow</div>
          <div
            className={`stat-kpi ${
              finance.cashflowThisMonth < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {formatCurrency(finance.cashflowThisMonth)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">Savings Rate</div>
          <div className="stat-kpi">{formatPercent(finance.savingsRate)}</div>
        </div>
      </section>

      {/* CATEGORY SUMMARY */}
      <section className="stat-card">
        <div className="stat-head mb-4">Category Overview</div>

        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-700 sticky top-0 bg-richBlack">
              <tr>
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-right py-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.map((row) => (
                <tr key={row.category} className="border-b border-gray-800">
                  <td className="py-2">{row.category}</td>
                  <td
                    className={`py-2 text-right ${
                      row.amount < 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="py-2 text-right text-gray-400">
                    {row.share.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && (
        <ModalAddTransaction
          initial={editing}
          onAdd={saveTransaction}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}

      <Toasts toasts={toasts} />
    </main>
  );
}
