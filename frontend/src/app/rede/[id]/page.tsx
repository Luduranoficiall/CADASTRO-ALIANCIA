"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Membro {
  id: string;
  nome: string;
  email: string;
}

interface RedeData {
  nivel1: Membro[];
  nivel2: Membro[];
  nivel3: Membro[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Rede({ params }: PageProps) {
  const { id } = use(params);
  const [rede, setRede] = useState<RedeData>({ nivel1: [], nivel2: [], nivel3: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRede = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rede/${id}`);
        const data = await res.json();
        setRede(data);
      } catch (error) {
        console.error("Erro ao carregar rede:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRede();
  }, [id]);

  const niveis = [
    { key: "nivel1" as const, label: "Nível 1", color: "cyan", icon: "👤" },
    { key: "nivel2" as const, label: "Nível 2", color: "blue", icon: "👥" },
    { key: "nivel3" as const, label: "Nível 3", color: "purple", icon: "🌐" }
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando rede...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <span className="text-2xl">🌐</span>
              </div>
              <h1 className="text-3xl font-black gradient-text">Rede Multinível</h1>
            </div>
            <p className="text-gray-400">Visualização da rede do membro #{id}</p>
          </div>
          <Link
            href={`/rede-visual/${id}`}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center gap-2"
          >
            🌳 Ver em Árvore 3D
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {niveis.map((nivel) => (
          <div key={nivel.key} className="glass-bg rounded-2xl p-6 border border-white/10 text-center">
            <span className="text-2xl block mb-2">{nivel.icon}</span>
            <p className="text-3xl font-black text-white">{rede[nivel.key].length}</p>
            <p className={`text-${nivel.color}-400 text-sm`}>{nivel.label}</p>
          </div>
        ))}
      </div>

      {/* Network Levels */}
      {niveis.map((nivel) => (
        <div key={nivel.key} className="glass-bg rounded-3xl p-8 mb-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl bg-${nivel.color}-500/20 flex items-center justify-center`}>
              <span className="text-xl">{nivel.icon}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{nivel.label}</h2>
            <span className={`ml-auto px-3 py-1 rounded-lg text-sm font-semibold bg-${nivel.color}-500/20 text-${nivel.color}-400`}>
              {rede[nivel.key].length} membros
            </span>
          </div>

          {rede[nivel.key].length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-3xl block mb-2">👤</span>
              <p>Nenhum membro neste nível ainda</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {rede[nivel.key].map((m: Membro) => (
                <li key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {m.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{m.nome}</p>
                      <p className="text-sm text-gray-500">{m.email}</p>
                    </div>
                  </div>
                  <Link
                    href={`/rede/${m.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                  >
                    Ver rede →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
