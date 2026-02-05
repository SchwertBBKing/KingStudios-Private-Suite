import React from "react";

export default function Sidebar({ username = "SchwertBBKing", studio = "KingStudios" }) {
  return (
    <aside
      className="w-72 p-8 flex flex-col justify-between"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        borderRight: "1px solid rgba(212,175,55,0.04)",
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gold font-semibold gold-glow">{studio}</h2>
            <p className="text-sm small-muted">{username} - Private Suite</p>
          </div>
          <div className="avatar"><img src="src/logo.png" /></div>
        </div>

        <nav className="mt-6 space-y-2">
          <div className="nav-item text-gray-300">
            <span>Overview</span>
          </div>
          <div className="nav-item text-gray-300">
            <span>Transactions</span>
          </div>
          <div className="nav-item text-gray-300">
            <span>Investments</span>
          </div>
          <div className="nav-item text-gray-300">
            <span>Settings</span>
          </div>
        </nav>

        <div className="mt-6 p-4 rounded card text-sm small-muted">
          <div className="font-medium text-white">Platinum Member</div>
          <div className="text-xs">Last login: {new Date().toLocaleDateString("en-US")}</div>
        </div>
      </div>

      <div className="text-gray-500 text-sm small-muted">
        <div className="border-t border-gray-800 pt-4 mt-6">Version 0.1 - Offline</div>
      </div>
    </aside>
  );
}
