import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import TransactionList from "../components/TransactionList";
import ModalAddTransaction from "../components/ModalAddTransaction";
import Toasts from "../components/Toast";
import { getAllTx, saveTx, deleteTx } from "../db";
import useFinance from "../hooks/useFinance";
import { formatCurrency, formatPercent } from "../utils/format";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#FFD700", "#00FF99", "#FF6B6B", "#1E90FF", "#FF8C00"];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load transactions from "DB"
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

  // Toast helper
  const toast = (text) => {
    const id = Date.now();
    setToasts((s) => [{ id, text }, ...s]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 3000);
  };

  // CRUD
  const saveTransaction = async (tx) => {
    const data = tx.id
      ? tx
      : { ...tx, id: Date.now(), createdAt: Date.now() };
    await saveTx(data);
    setTransactions((s) =>
      tx.id ? s.map((t) => (t.id === tx.id ? data : t)) : [data, ...s]
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

  // Charts preparation
  const lineData = useMemo(() => {
    let cum = 0;
    const sorted = [...transactions].sort((a, b) => a.createdAt - b.createdAt);
    return sorted.map((t) => {
      cum += Number(t.amount);
      return { date: new Date(t.createdAt).toLocaleDateString(), balance: cum };
    });
  }, [transactions]);

  const barData = useMemo(() => {
    // Monthly income vs expenses
    const monthTotals = {};
    transactions.forEach((t) => {
      const month = new Date(t.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthTotals[month]) monthTotals[month] = { income: 0, expenses: 0 };
      if (t.amount > 0) monthTotals[month].income += t.amount;
      else monthTotals[month].expenses += Math.abs(t.amount);
    });
    return Object.entries(monthTotals).map(([month, val]) => ({
      month,
      income: val.income,
      expenses: val.expenses,
    }));
  }, [transactions]);

  const pieData = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (!totals[t.category]) totals[t.category] = 0;
      totals[t.category] += Math.abs(t.amount);
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="flex-1 p-8 bg-richBlack text-white overflow-y-auto">
      {/* HEADER */}
      <Header
        balance={finance.balance}
        onAdd={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        onSearch={(v) => console.log(v)}
        onExport={() => console.log("export")}
        studio="KingStudios"
      />

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-gold mb-4">Cashflow</h2>
          <p className="text-sm text-gray-400">Income vs Expenses</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#00FF99" />
              <Bar dataKey="expenses" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold text-gold mb-4">Balance Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY PIE CHART */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold text-gold mb-4">Categories</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg flex flex-col h-[500px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold text-gold">Recent Transactions</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TransactionList
            transactions={transactions}
            onEdit={(tx) => {
              setEditing(tx);
              setModalOpen(true);
            }}
            onDelete={removeTransaction}
          />
        </div>
      </div>

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
    </div>
  );
}
