import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ studio = "KingStudios" }) {
  const menu = [
    { name: "Overview",       path: "/",              enabled: true, new: false },
    { name: "Transactions",   path: "/transactions",  enabled: false, new: false },
    { name: "Subscriptions",  path: "/subscriptions", enabled: false, new: false },
    { name: "Forecast",       path: "/forecast",      enabled: false, new: false },
    { name: "Settings",       path: "/settings",      enabled: false, new: false },
  ];

  const location = useLocation();

  return (
    <aside
      className="w-72 flex flex-col justify-between p-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        borderRight: "1px solid rgba(212,175,55,0.04)",
      }}
    >
      {/* Top: Logo + Studio */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl text-gold font-semibold drop-shadow-lg">
              {studio}
            </h2>
            <p className="text-sm text-gray-400/70">Personal - Private Suite</p>
          </div>
          <div className="w-12 h-12">
            <img
              src="src/logo.png"
              alt="Logo"
              className="w-full h-full object-contain opacity-90"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.enabled ? item.path : "#"}
              className={`text-left px-4 py-2 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? "text-gold bg-white/5"
                  : "text-white/80 hover:text-gold hover:bg-white/5"
              } ${!item.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {item.name}{" "}
              {!item.enabled && (
                <span className="text-gold font-luxury text-xs">(Soon)</span>
              )}
              {item.new && (
                <span className="text-gold font-luxury text-xs ml-1">
                  (New)
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Member Info */}
        <div className="mt-8 p-4 rounded-xl bg-richBlack/30">
          <div className="font-medium text-gold">{studio}</div>
          <div className="text-xs text-gray-400/70">Platinum Member</div>
          <div className="text-xs text-gray-400/60 mt-1">
            Last login: {new Date().toLocaleDateString("en-US")}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-400/50 text-xs mt-6 border-t border-gray-800 pt-4">
        Version 0.1 - Offline
      </div>
    </aside>
  );
}
