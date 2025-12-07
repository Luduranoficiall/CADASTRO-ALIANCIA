
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm text-neutral-300">{label}</span>
      <input {...props} className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3" />
    </div>
  );
}
