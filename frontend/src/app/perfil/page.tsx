"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../lib/api";
import { useToast } from "../../components/Toast";
import Link from "next/link";

interface User {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  cpf: string;
  data_nascimento: string;
}

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      if (u) setForm(u);
      setLoading(false);
    });
  }, []);

  function update<K extends keyof User>(key: K, val: User[K]) {
    setForm({ ...form, [key]: val } as User);
  }

  async function salvar() {
    setSaving(true);
    try {
      // API call to update profile
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8000/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      setUser(form);
      setEditing(false);
      showToast("success", "Perfil atualizado com sucesso! 💜");
    } catch {
      showToast("error", "Não foi possível salvar. Tente novamente.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (!user || !form) return null;

  return (
    <div className="min-h-[80vh] w-full max-w-3xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black gradient-text">{user.nome}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
              ${editing 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
              }`}
          >
            {editing ? '✕ Cancelar' : '✏️ Editar'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-bg rounded-3xl p-8 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📋</span> Informações Pessoais
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-400">👤 Nome Completo</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => update("nome", e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-3.5 rounded-xl border text-white transition-all
                ${editing 
                  ? 'bg-white/5 border-white/10 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20' 
                  : 'bg-white/5 border-transparent cursor-not-allowed'
                }`}
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-400">📱 Telefone</label>
            <input
              type="text"
              value={form.telefone}
              onChange={e => update("telefone", e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-3.5 rounded-xl border text-white transition-all
                ${editing 
                  ? 'bg-white/5 border-white/10 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20' 
                  : 'bg-white/5 border-transparent cursor-not-allowed'
                }`}
            />
          </div>

          {/* Endereço */}
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-400">🏠 Endereço</label>
            <input
              type="text"
              value={form.endereco}
              onChange={e => update("endereco", e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-3.5 rounded-xl border text-white transition-all
                ${editing 
                  ? 'bg-white/5 border-white/10 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20' 
                  : 'bg-white/5 border-transparent cursor-not-allowed'
                }`}
            />
          </div>

          {/* Email - Read Only */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-400">
              📧 E-mail <span className="text-gray-600">(não editável)</span>
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* CPF - Read Only */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-400">
              🆔 CPF <span className="text-gray-600">(não editável)</span>
            </label>
            <input
              type="text"
              value={form.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4")}
              disabled
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Data Nascimento - Read Only */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-400">
              📅 Data de Nascimento <span className="text-gray-600">(não editável)</span>
            </label>
            <input
              type="text"
              value={new Date(form.data_nascimento).toLocaleDateString('pt-BR')}
              disabled
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <button
            onClick={salvar}
            disabled={saving}
            className="mt-8 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </>
            ) : (
              <>
                💾 Salvar Alterações
              </>
            )}
          </button>
        )}
      </div>

      {/* Security Section */}
      <div className="glass-bg rounded-3xl p-8 mt-8 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🔐</span> Segurança
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/recuperar-senha"
            className="flex-1 py-4 rounded-xl font-semibold text-center text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            🔑 Alterar Senha
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex-1 py-4 rounded-xl font-semibold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            🚪 Sair da Conta
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🔒 Seus dados são protegidos com criptografia AES-256</p>
      </div>
    </div>
  );
}
