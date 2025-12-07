"use client";

import { useState } from "react";
import { useToast } from "../../components/Toast";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !senha) {
      showToast("error", "Por favor, preencha todos os campos.");
      return;
    }
    
    setLoading(true);
    const ok = await login(email, senha);
    setLoading(false);
    
    if (ok) {
      showToast("success", "Login realizado com sucesso! Bem-vindo de volta! 🎉");
      router.push("/painel");
    } else {
      showToast("error", "E-mail ou senha incorretos. Se esqueceu a senha, clique em 'Esqueci minha senha'.");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card com Glass Effect */}
        <div className="glass-bg rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/25">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-black gradient-text mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-400">
              Acesse sua conta ALIANCI.A
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                📧 E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                🔒 Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/recuperar-senha" 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  🚀 Entrar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400 mb-3">
              Ainda não tem conta?
            </p>
            <Link 
              href="/cadastro"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
            >
              ✨ Criar conta gratuita
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <span>🔒</span>
          <span>Conexão segura com criptografia AES-256</span>
        </div>
      </div>
    </div>
  );
}
