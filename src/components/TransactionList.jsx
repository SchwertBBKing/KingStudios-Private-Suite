import React from "react";

export default function TransactionList({ transactions = [], onDelete, onEdit }) {
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(n);
  return (
    <div className="rounded-2xl p-6 card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">Recent Activity</h3>
        <div className="text-sm small-muted">Latest</div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-gray-400">No transactions yet. Add one to get started.</div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded hover:bg-[rgba(255,255,255,0.02)] transition"
            >
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm small-muted">
                  {t.category || "-"} - {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US") : ""}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="tx-badge">{t.category || "-"}</div>
                <div className={`font-semibold ${t.amount >= 0 ? "text-emerald-300" : "text-gold"}`}>
                  {fmt(t.amount)}
                </div>
                <button onClick={() => onEdit?.(t)} className="text-sm text-gray-400 hover:text-white">
                  Edit
                </button>
                <button onClick={() => onDelete?.(t.id)} className="text-sm text-gray-500 hover:text-white">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
