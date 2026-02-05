import React from "react";

function Sparkline({ points = [] }) {
  if (!points.length) return null;
  const w = 220;
  const h = 48;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1 || 1);
  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="mt-4">
      <path
        d={d}
        fill="none"
        stroke="#d4af37"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        <div>
          <p className="text-sm small-muted tracking-widest uppercase">
            Balance
          </p>
          <h2 className="text-5xl font-semibold text-gold mt-3 gold-glow">
            {formatter.format(balance)}
          </h2>
          <p
            className={`text-sm mt-3 ${monthlyChange >= 0 ? "text-emerald-300" : "text-red-300"}`}
          >
            {monthlyChange >= 0 ? "+" : "-"}{" "}
            {formatter.format(Math.abs(monthlyChange))} this month
          </p>
          <div className="mt-6">
            <Sparkline points={last} />
          </div>

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

        <div className="justify-self-start lg:justify-self-end wallet-card-wrapper">
          <div className="wallet-card">
            {/* Background Effects */}
            <div className="wallet-card__shine" />
            <div className="wallet-card__halo" />
            <div className="wallet-card__noise" />
            <div className="wallet-card__gloss" />
            <div className="wallet-card__pattern" />

            {/* Brand & Tier */}
            <div className="wallet-card__brand">
              <div className="wallet-card__logo">KING</div>
              <div className="wallet-card__tier">GOLD</div>
            </div>

            {/* Chip */}
            <div className="wallet-card__chip" aria-label="Card Chip">
              <div className="wallet-card__chip-lines">
                <span />
                <span />
                <span />
              </div>
            </div>

            {/* Card Number */}
            <div className="wallet-card__number" aria-label="Card Number">
              3712 34** **** 9017
            </div>

            {/* Card Info */}
            <div className="wallet-card__row">
              <div>
                <div className="wallet-card__label">Member Since</div>
                <div className="wallet-card__value">2010</div>
              </div>
              <div>
                <div className="wallet-card__label">Card Holder</div>
                <div className="wallet-card__value">SchwertBBKing</div>
              </div>
              <div>
                <div className="wallet-card__label">Valid Thru</div>
                <div className="wallet-card__value">13/99</div>
              </div>
            </div>

            {/* Network & Contactless */}
            <div className="wallet-card__network">KingStudios</div>
            <div
              className="wallet-card__contactless"
              aria-label="Contactless Payment Icon"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
