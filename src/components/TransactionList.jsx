import React from "react";

export default function TransactionList({ transactions = [], onDelete, onEdit, compact = false }) {
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-gold">Recent Activity</h3>
        <span className="text-sm text-gray-400/70">Latest</span>
      </div>

      {/* List */}
      <div className={`flex flex-col gap-3 overflow-y-auto ${compact ? "max-h-72" : "max-h-96"}`}>
        {transactions.length === 0 ? (
          <div className="text-gray-400/80 text-sm text-center py-6 rounded-xl bg-[#1a1a1a]/80">
            No transactions yet. Add one to get started.
          </div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 rounded-xl transition hover:scale-[1.01]"
              style={{
                background: "linear-gradient(145deg, #1a1a1a 0%, #222222 50%, #1c1c1c 100%)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 35px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Left: Name + Category + Date */}
              <div className="flex flex-col">
                <span className="font-medium text-white">{t.name}</span>
                <span className="text-sm text-gray-400/70">
                  {t.category || "-"} • {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US") : ""}
                </span>
              </div>

              {/* Right: Amount + Actions */}
              <div className="flex items-center gap-3">
                {/* Amount */}
                <span
                  className={`font-semibold ${
                    t.amount >= 0 ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {fmt(t.amount)}
                </span>

                {/* Buttons */}
                <button
                  onClick={() => onEdit?.(t)}
                  className="text-xs text-gray-400/60 hover:text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(t.id)}
                  className="text-xs text-gray-400/60 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scroll Hint */}
      {transactions.length > (compact ? 6 : 10)}
    </div>
  );
}
