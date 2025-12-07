import React from "react";

export default function ToastInline({ type, message, onClose }: { type: "success" | "error"; message: string; onClose?: () => void }) {
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-white text-center transition-all animate-fade-in-down ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
      onClick={onClose}
      style={{ cursor: onClose ? "pointer" : undefined }}
    >
      {message}
    </div>
  );
}