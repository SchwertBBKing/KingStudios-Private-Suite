import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";
import Header from "./components/Header";
import ModalAddTransaction from "./components/ModalAddTransaction";
import Toasts from "./components/Toast";

const initialTx = [
  { id: 1, name: "Private Jet Charter", amount: -12000, category: "Travel", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30 },
  { id: 2, name: "Michelin Restaurant", amount: -420, category: "Dining", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  { id: 3, name: "Investment Return", amount: 3200, category: "Income", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem("tx");
      return s ? JSON.parse(s) : initialTx;
    } catch {
      return initialTx;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("tx", JSON.stringify(transactions));
  }, [transactions]);

  const [toasts, setToasts] = useState([]);
  const addToast = (text, opts = {}) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [{ id, text, ...opts }, ...s]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), opts.duration || 3500);
  };

  const saveTransaction = (tx) => {
    const isUpdate = !!tx.id;
    if (isUpdate) {
      setTransactions((s) => s.map((t) => (t.id === tx.id ? { ...t, ...tx } : t)));
      addToast("Transaction updated");
    } else {
      const newTx = { ...tx, id: Date.now(), createdAt: tx.createdAt || Date.now() };
      setTransactions((s) => [newTx, ...s]);
      addToast("Transaction added");
    }
    setModalOpen(false);
    setEditing(null);
  };

  const deleteTransaction = (id) => {
    setTransactions((s) => s.filter((t) => t.id !== id));
    addToast("Transaction deleted");
  };

  const onEdit = (tx) => {
    setEditing(tx);
    setModalOpen(true);
  };

  const exportCSV = () => {
    const headers = ["id", "name", "amount", "category", "createdAt"];
    const rows = transactions.map((t) => [t.id, t.name, t.amount, t.category || "", new Date(t.createdAt).toISOString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kingstudios-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported");
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !(e.metaKey || e.ctrlKey)) {
        const el = document.getElementById("search-input");
        if (el) {
          e.preventDefault();
          el.focus();
        }
      } else if (e.key.toLowerCase() === "n" && !(e.metaKey || e.ctrlKey)) {
        const active = document.activeElement;
        if (active && /input|textarea/i.test(active.tagName)) return;
        setEditing(null);
        setModalOpen(true);
      } else if (e.key.toLowerCase() === "e" && !(e.metaKey || e.ctrlKey)) {
        exportCSV();
      } else if (e.key === "Escape") {
        if (modalOpen) setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen, transactions]);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (search && !`${t.name} ${t.category || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, categoryFilter]);

  const balance = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="flex h-screen bg-richBlack text-white font-luxury">
      <Sidebar username="Personal" studio="KingStudios" />
      <main className="flex-1 p-10 space-y-6">
        <Header
          balance={balance}
          onAdd={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          onSearch={setSearch}
          onExport={exportCSV}
          username="Personal"
          studio="KingStudios"
          categories={categories}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <BalanceCard balance={balance} monthlyChange={2340} transactions={transactions} />
          </div>
          <div className="md:col-span-1">
            <TransactionList transactions={filtered} onDelete={deleteTransaction} onEdit={onEdit} />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="stat-head">VIP Limit</div>
            <div className="stat-kpi">EUR 80,000</div>
            <div className="stat-sub">Monthly budget</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Rewards</div>
            <div className="stat-kpi">12,480</div>
            <div className="stat-sub">Gold points</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Assets</div>
            <div className="stat-kpi">EUR 240.5k</div>
            <div className="stat-sub">Total portfolio</div>
          </div>
          <div className="stat-card">
            <div className="stat-head">Risk</div>
            <div className="stat-kpi">Low</div>
            <div className="stat-sub">Portfolio volatility</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="vip-panel">
            <div className="vip-title">Concierge</div>
            <div className="vip-value">24/7 available</div>
            <div className="vip-sub">Priority requests, travel & dining</div>
          </div>
          <div className="vip-panel">
            <div className="vip-title">Liquidity</div>
            <div className="vip-value">EUR 16,240</div>
            <div className="vip-sub">Instant access</div>
          </div>
          <div className="vip-panel">
            <div className="vip-title">Private Deals</div>
            <div className="vip-value">3 open</div>
            <div className="vip-sub">New opportunities</div>
          </div>
        </section>
      </main>
      {modalOpen && (
        <ModalAddTransaction
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onAdd={saveTransaction}
          initial={editing}
        />
      )}

      <div aria-live="polite">
        <Toasts toasts={toasts} />
      </div>
    </div>
  );
}
