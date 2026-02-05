import React from "react";

export default function Header({
  balance,
  onAdd,
  onSearch,
  onExport,
  username,
  studio,
  categories = [],
  selectedCategory,
  onCategoryChange,
}) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" });
  return (
    <header className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="avatar"><img src="src/logo.png" /></div>
          <div>
            <h1 className="text-3xl font-playfair text-gold gold-glow">{studio}</h1>
            <p className="text-sm small-muted">{username} - Private Suite</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            id="search-input"
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search... ( / )"
            className="px-4 py-2 rounded-full modal-input w-72 text-sm text-gray-200"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange?.(e.target.value)}
          className="px-3 py-2 rounded modal-input text-sm text-gray-200"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c || "All categories"}
            </option>
          ))}
        </select>

        <button onClick={onExport} title="Export CSV" className="btn-muted">
          Export
        </button>

        <div className="bg-gray-900 px-3 py-2 rounded modal-input text-right">
          <div className="text-sm small-muted">Available</div>
          <div className="text-lg font-semibold text-white">{formatter.format(balance)}</div>
        </div>

        <button onClick={onAdd} className="btn-gold">
          New
        </button>
      </div>
    </header>
  );
}
