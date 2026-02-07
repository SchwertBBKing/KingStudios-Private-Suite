import React from "react";

export default function Header({
  balance = 0,
  onAdd,
  onSearch,
  onExport,
  studio = "KingStudios",
}) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  const safeBalance = Number(balance) || 0;

  return (
    <header className="flex items-center justify-between">
      {/* LEFT: Studio */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10">
          <img
            src="src/logo.png"
            alt="Logo"
            className="w-full h-full object-contain opacity-90"
          />
        </div>

        <div>
          <h1 className="text-3xl font-playfair text-gold gold-glow leading-tight">
            {studio}
          </h1>
          <p className="text-sm small-muted">
            Personal · Private Suite
          </p>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        {/* Search (disabled for now) */}
        <input
          type="text"
          placeholder="Search… ( / )"
          disabled
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-64 rounded-full bg-black/60 px-4 py-2 text-sm text-gray-200 placeholder-gray-500 cursor-not-allowed
                     focus:outline-none focus:ring-1 focus:ring-gold transition"
        />

        {/* Export */}
        <button
          onClick={onExport}
          className="px-4 py-2 rounded-full border border-white/10 text-sm text-white/80
                     hover:text-gold hover:border-gold/40 transition"
        >
          Export
        </button>

        {/* Balance */}
        <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/5 text-right">
          <div className="text-xs small-muted tracking-wider uppercase">
            Available
          </div>
          <div className="text-lg font-semibold text-white">
            {formatter.format(safeBalance)}
          </div>
        </div>

        {/* New Transaction */}
        <button
          onClick={onAdd}
          className="btn-gold px-6 py-2 rounded-full font-medium tracking-wide"
        >
          New
        </button>
      </div>
    </header>
  );
}
