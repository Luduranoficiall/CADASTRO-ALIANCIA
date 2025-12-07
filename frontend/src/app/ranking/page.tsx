"use client";

import { useEffect, useState } from "react";

interface RankUser {
  id?: string;
  nome: string;
  pontos: number;
  nivel?: string;
  avatar?: string;
}

export default function Ranking() {
  const [rank, setRank] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const res = await fetch(`http://localhost:8000/ranking?period=${period}`);
        const data = await res.json();
        setRank(data);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, [period]);

  const getMedalEmoji = (position: number) => {
    if (position === 0) return "🥇";
    if (position === 1) return "🥈";
    if (position === 2) return "🥉";
    return `#${position + 1}`;
  };

  const getPositionStyle = (position: number) => {
    if (position === 0) return "from-amber-500/30 to-yellow-500/30 border-amber-500/50";
    if (position === 1) return "from-gray-400/30 to-slate-500/30 border-gray-400/50";
    if (position === 2) return "from-orange-600/30 to-amber-700/30 border-orange-600/50";
    return "from-white/5 to-white/5 border-white/10";
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full max-w-4xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <span className="text-2xl">🏆</span>
              </div>
              <h1 className="text-3xl font-black gradient-text">Ranking</h1>
            </div>
            <p className="text-gray-400">Os membros mais ativos da comunidade</p>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "week", label: "Esta Semana" },
          { key: "month", label: "Este Mês" },
          { key: "all", label: "Geral" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as typeof period)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${period === p.key 
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {rank.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex-1 max-w-[180px]">
            <div className="glass-bg rounded-2xl p-6 border border-gray-400/30 text-center">
              <span className="text-4xl mb-2 block">🥈</span>
              <p className="font-bold text-white truncate">{rank[1]?.nome}</p>
              <p className="text-2xl font-black text-gray-400">{rank[1]?.pontos}</p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="flex-1 max-w-[200px]">
            <div className="glass-bg rounded-2xl p-8 border-2 border-amber-500/50 text-center bg-gradient-to-b from-amber-500/10 to-transparent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                👑 LÍDER
              </div>
              <span className="text-5xl mb-2 block">🥇</span>
              <p className="font-bold text-white text-lg truncate">{rank[0]?.nome}</p>
              <p className="text-3xl font-black gradient-text">{rank[0]?.pontos}</p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="flex-1 max-w-[180px]">
            <div className="glass-bg rounded-2xl p-6 border border-orange-600/30 text-center">
              <span className="text-4xl mb-2 block">🥉</span>
              <p className="font-bold text-white truncate">{rank[2]?.nome}</p>
              <p className="text-2xl font-black text-orange-400">{rank[2]?.pontos}</p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>
          </div>
        </div>
      )}

      {/* Full List */}
      <div className="glass-bg rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-bold text-white flex items-center gap-2">
            <span>📊</span> Ranking Completo
          </h2>
        </div>
        
        <ul className="divide-y divide-white/5">
          {rank.map((u, i) => (
            <li 
              key={u.id || i} 
              className={`p-6 flex items-center justify-between hover:bg-white/5 transition-colors
                ${i < 3 ? `bg-gradient-to-r ${getPositionStyle(i)}` : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
                  ${i < 3 
                    ? 'bg-transparent' 
                    : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {i < 3 ? (
                    <span className="text-2xl">{getMedalEmoji(i)}</span>
                  ) : (
                    <span>#{i + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{u.nome}</p>
                  {u.nivel && <p className="text-xs text-gray-500">{u.nivel}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${i < 3 ? 'gradient-text' : 'text-cyan-400'}`}>
                  {u.pontos.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
            </li>
          ))}
        </ul>

        {rank.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">🏆</span>
            <p className="text-gray-400">Nenhum membro no ranking ainda</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Ganhe pontos indicando novos membros e alcance o topo!</p>
      </div>
    </div>
  );
}
