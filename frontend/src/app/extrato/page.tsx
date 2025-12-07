"use client";

import { useEffect, useState } from "react";

interface Movimento {
  tipo: string;
  valor: number;
  data: string;
  descricao?: string;
  status?: string;
}

export default function Extrato() {
  const [mov, setMov] = useState<Movimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "entrada" | "saida">("all");
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/extrato", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMov(data);
        
        // Calculate balance
        const total = data.reduce((acc: number, m: Movimento) => {
          return m.tipo.toLowerCase().includes("entrada") || m.tipo.toLowerCase().includes("bônus")
            ? acc + m.valor
            : acc - m.valor;
        }, 0);
        setSaldo(total);
      } catch (error) {
        console.error("Erro ao carregar extrato:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMov = mov.filter(m => {
    if (filter === "all") return true;
    if (filter === "entrada") return m.tipo.toLowerCase().includes("entrada") || m.tipo.toLowerCase().includes("bônus");
    return m.tipo.toLowerCase().includes("saida") || m.tipo.toLowerCase().includes("saque");
  });

  const getTypeIcon = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes("bônus") || t.includes("bonus")) return "🎁";
    if (t.includes("entrada") || t.includes("recebido")) return "💰";
    if (t.includes("saque") || t.includes("saida")) return "💸";
    if (t.includes("comissão") || t.includes("comissao")) return "🤝";
    return "📋";
  };

  const isPositive = (tipo: string) => {
    const t = tipo.toLowerCase();
    return t.includes("entrada") || t.includes("bônus") || t.includes("bonus") || t.includes("comissão");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando extrato...</p>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-2xl">💰</span>
              </div>
              <h1 className="text-3xl font-black gradient-text">Extrato Financeiro</h1>
            </div>
            <p className="text-gray-400">Acompanhe todas as suas movimentações</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Saldo Disponível</p>
          <p className={`text-4xl sm:text-5xl font-black ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            R$ {saldo.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Todos", icon: "📋" },
          { key: "entrada", label: "Entradas", icon: "💰" },
          { key: "saida", label: "Saídas", icon: "💸" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2
              ${filter === f.key 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="glass-bg rounded-3xl border border-white/10 overflow-hidden">
        {filteredMov.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-gray-400">Nenhuma movimentação encontrada</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filteredMov.map((m, i) => (
              <li key={i} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                      ${isPositive(m.tipo) 
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      {getTypeIcon(m.tipo)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{m.tipo}</p>
                      <p className="text-gray-500 text-sm">{m.data}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isPositive(m.tipo) ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive(m.tipo) ? '+' : '-'} R$ {m.valor.toFixed(2).replace('.', ',')}
                    </p>
                    {m.status && (
                      <span className={`text-xs px-2 py-1 rounded-lg
                        ${m.status === 'confirmado' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 As comissões são creditadas automaticamente após confirmação do pagamento.</p>
      </div>
    </div>
  );
}
