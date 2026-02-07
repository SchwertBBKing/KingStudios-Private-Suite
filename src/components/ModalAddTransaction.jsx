import React, { useEffect, useState } from "react";

const CATEGORIES = [
  "Income",
  "Food",
  "Transport",
  "Housing",
  "Subscriptions",
  "Shopping",
  "Travel",
  "Other",
];

export default function ModalAddTransaction({
  onClose,
  onAdd,
  initial = null,
}) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");

  /* ---------------- Init ---------------- */
  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setAmount(Math.abs(initial.amount ?? ""));
      setCategory(initial.category || "Other");
      setType(initial.amount >= 0 ? "income" : "expense");
    }
  }, [initial]);

  /* ---------------- Submit ---------------- */
  const submit = (e) => {
    e.preventDefault();
    if (!name || amount === "") return;

    const parsed = Number(amount);
    if (Number.isNaN(parsed)) return;

    const signedAmount = type === "expense" ? -Math.abs(parsed) : Math.abs(parsed);

    const out = {
      name,
      amount: signedAmount,
      category,
    };

    if (initial?.id) out.id = initial.id;
    if (initial?.createdAt) out.createdAt = initial.createdAt;

    onAdd(out);

    setName("");
    setAmount("");
    setCategory("Other");
    setType("expense");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl bg-softGray p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {initial ? "Edit transaction" : "New transaction"}
          </h2>
          <p className="text-sm text-gray-400">
            Track income and expenses precisely
          </p>
        </div>

        {/* Type Switch */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-richBlack p-1">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`rounded-lg py-2 text-sm transition ${
              type === "expense"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`rounded-lg py-2 text-sm transition ${
              type === "income"
                ? "bg-green-500/20 text-green-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-xs text-gray-400">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1 w-full rounded-xl bg-transparent border border-gray-700 px-4 py-3 text-lg focus:border-gold focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-xs text-gray-400">Description</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Salary, Rent, Netflix"
            className="mt-1 w-full rounded-xl bg-transparent border border-gray-700 px-4 py-2 focus:border-gold focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="text-xs text-gray-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl bg-transparent border border-gray-700 px-4 py-2 focus:border-gold focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-richBlack">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-2 font-semibold text-richBlack hover:opacity-90"
          >
            {initial ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
