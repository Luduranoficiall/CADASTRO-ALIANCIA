"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../lib/api";
import Loader from "../../components/Loader";
import Link from "next/link";

interface User {
  id: string;
  nome: string;
  email: string;
  patrocinador_1?: string;
  patrocinador_2?: string;
  patrocinador_3?: string;
}

interface NetworkStats {
  nivel1: number;
  nivel2: number;
  nivel3: number;
  total: number;
}

export default function Painel() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<NetworkStats>({ nivel1: 0, nivel2: 0, nivel3: 0, total: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getUser().then(setUser);
    // Simulated network stats - replace with real API call
    const loadStats = async () => {
      // Defer state update
      await Promise.resolve();
      setStats({ nivel1: 5, nivel2: 12, nivel3: 28, total: 45 });
    };
    loadStats();
  }, []);

  const copyLink = () => {
    if (user) {
      navigator.clipboard.writeText(`https://aliancia.com/?ref=${user.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return <Loader />;

  const quickActions = [
    { href: "/rede-visual/1", icon: "🌐", label: "Ver Rede", color: "cyan" },
    { href: "/extrato", icon: "💰", label: "Extrato", color: "emerald" },
    { href: "/pagar", icon: "💳", label: "Pagamento", color: "purple" },
    { href: "/perfil", icon: "👤", label: "Perfil", color: "amber" },
  ];

  return (
    <div className="min-h-[80vh] w-full max-w-6xl mx-auto p-4 sm:p-8">
      {/* Header Card */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 mb-1">Olá,</p>
            <h1 className="text-3xl sm:text-4xl font-black gradient-text">
              {user.nome.split(' ')[0]}! 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30">
              ✓ Membro Ativo
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-bg rounded-2xl p-6 border border-white/10 group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">👥</span>
            <span className="text-xs text-cyan-400 font-semibold">Nível 1</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.nivel1}</p>
          <p className="text-gray-500 text-sm">Diretos</p>
        </div>

        <div className="glass-bg rounded-2xl p-6 border border-white/10 group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">👥</span>
            <span className="text-xs text-blue-400 font-semibold">Nível 2</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.nivel2}</p>
          <p className="text-gray-500 text-sm">Indiretos</p>
        </div>

        <div className="glass-bg rounded-2xl p-6 border border-white/10 group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">👥</span>
            <span className="text-xs text-purple-400 font-semibold">Nível 3</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.nivel3}</p>
          <p className="text-gray-500 text-sm">Rede Expandida</p>
        </div>

        <div className="glass-bg rounded-2xl p-6 border border-white/10 group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🌟</span>
            <span className="text-xs text-emerald-400 font-semibold">Total</span>
          </div>
          <p className="text-3xl font-black gradient-text">{stats.total}</p>
          <p className="text-gray-500 text-sm">Na sua rede</p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔗</span>
          <h2 className="text-xl font-bold text-white">Seu Link de Indicação</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 font-mono text-sm break-all">
            https://aliancia.com/?ref={user.id}
          </div>
          <button
            onClick={copyLink}
            className={`px-6 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
              ${copied 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
              }`}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          Compartilhe este link e ganhe bônus por cada novo membro que se cadastrar!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass-bg rounded-2xl p-6 border border-white/10 hover:border-${action.color}-500/30 transition-all group text-center`}
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
              <p className="font-semibold text-gray-300 group-hover:text-white transition-colors">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sponsors Card */}
      <div className="glass-bg rounded-3xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🤝</span>
          <h2 className="text-xl font-bold text-white">Seus Patrocinadores</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 font-semibold mb-1">Nível 1 (Direto)</p>
            <p className="text-white font-bold">{user.patrocinador_1 || "—"}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400 font-semibold mb-1">Nível 2</p>
            <p className="text-white font-bold">{user.patrocinador_2 || "—"}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-xs text-purple-400 font-semibold mb-1">Nível 3</p>
            <p className="text-white font-bold">{user.patrocinador_3 || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
