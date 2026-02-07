import React from "react";
import Header from "../components/Header";

export default function Transactions() {
  return (
    <div className="flex h-screen bg-richBlack text-white font-luxury">
      <main className="flex-1 p-10 overflow-y-auto">
        {/* HEADER */}
        <Header
          studio="KingStudios"
        />

        <div className="mt-12 text-center">
          <h2 className="text-2xl text-gold mb-2">Subscriptions</h2>
          <p className="text-gray-400/70">
            Full Subscription history & analytics coming soon
          </p>
        </div>
      </main>
    </div>
  );
}