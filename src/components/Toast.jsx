import React from "react";

export default function Toasts({ toasts = [] }) {
  return (
    <div style={{position:'fixed', right:20, top:20, zIndex:60}}>
      {toasts.map(t => (
        <div key={t.id} className="toast text-sm text-white">
          {t.text}
        </div>
      ))}
    </div>
  );
}
