"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "../../components/Toast";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email) {
      showToast("error", "Por favor, informe seu e-mail.");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSent(true);
        showToast("success", "Instruções enviadas para seu e-mail!");
      } else {
        showToast("error", "E-mail não encontrado. Verifique e tente novamente.");
      }
    } catch {
      showToast("error", "Erro de conexão. Tente novamente.");
    }
    
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-bg rounded-3xl p-12 max-w-md text-center border border-white/10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📧</span>
          </div>
          <h2 className="text-2xl font-black gradient-text mb-4">E-mail Enviado!</h2>
          <p className="text-gray-400 mb-6">
            Verifique sua caixa de entrada (e spam) para encontrar as instruções de recuperação de senha.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
          >
            ← Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-bg rounded-3xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg shadow-amber-500/25">
              <span className="text-3xl">🔑</span>
            </div>
            <h1 className="text-3xl font-black gradient-text mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-400">
              Informe seu e-mail para receber as instruções
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                📧 Seu E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  📨 Enviar Instruções
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <span>🔒</span>
          <span>Link de recuperação válido por 1 hora</span>
        </div>
      </div>
    </div>
  );
}
