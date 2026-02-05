import React, { useEffect, useState } from "react";

export default function ModalAddTransaction({ onClose, onAdd, initial = null }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setAmount(String(initial.amount ?? ""));
      setCategory(initial.category || "");
    }
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!name || amount === "") return;
    const parsed = Number(amount);
    if (Number.isNaN(parsed)) return;
    const out = { name, amount: parsed, category };
    if (initial?.id) out.id = initial.id;
    if (initial?.createdAt) out.createdAt = initial.createdAt;
    onAdd(out);
    setName("");
    setAmount("");
    setCategory("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <form onSubmit={submit} className="relative bg-softGray p-6 rounded-2xl w-96 card">
        <h3 className="text-lg mb-4">{initial ? "Edit transaction" : "New transaction"}</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Description"
          className="w-full mb-3 p-2 rounded bg-transparent border border-gray-700"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (e.g. -1200 or 2500)"
          className="w-full mb-3 p-2 rounded bg-transparent border border-gray-700"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full mb-4 p-2 rounded bg-transparent border border-gray-700"
        />
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-700">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-gold text-richBlack font-semibold">
            {initial ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
