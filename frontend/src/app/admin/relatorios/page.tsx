"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

interface DadoMensal {
  mes: string;
  membros: number;
  receita?: number;
}

const dadosIniciais: DadoMensal[] = [
  { mes: "Jan", membros: 12, receita: 1164 },
  { mes: "Fev", membros: 30, receita: 2910 },
  { mes: "Mar", membros: 56, receita: 5432 },
  { mes: "Abr", membros: 77, receita: 7469 },
  { mes: "Mai", membros: 103, receita: 9991 },
  { mes: "Jun", membros: 145, receita: 14065 }
];

export default function Relatorios() {
  const [dados] = useState<DadoMensal[]>(dadosIniciais);
  const [chartType, setChartType] = useState<"line" | "area">("area");

  const totalMembros = dados[dados.length - 1]?.membros || 0;
  const totalReceita = dados.reduce((acc, d) => acc + (d.receita || 0), 0);
  const crescimento = dados.length >= 2 
    ? Math.round(((dados[dados.length - 1].membros - dados[dados.length - 2].membros) / dados[dados.length - 2].membros) * 100) 
    : 0;

  return (
    <div className="min-h-[80vh] w-full max-w-6xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl">📊</span>
              </div>
              <h1 className="text-3xl font-black gradient-text">Relatórios</h1>
            </div>
            <p className="text-gray-400">Análise de crescimento da plataforma</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Total de Membros</p>
          <p className="text-3xl font-black gradient-text">{totalMembros}</p>
          <p className="text-emerald-400 text-sm mt-1">+{crescimento}% vs mês anterior</p>
        </div>
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Receita Total</p>
          <p className="text-3xl font-black text-emerald-400">R$ {totalReceita.toLocaleString('pt-BR')}</p>
          <p className="text-gray-500 text-sm mt-1">Acumulado do período</p>
        </div>
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Ticket Médio</p>
          <p className="text-3xl font-black text-cyan-400">R$ 97,00</p>
          <p className="text-gray-500 text-sm mt-1">Por membro</p>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setChartType("area")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${chartType === "area" 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          📈 Área
        </button>
        <button
          onClick={() => setChartType("line")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${chartType === "line" 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
          📉 Linha
        </button>
      </div>

      {/* Chart */}
      <div className="glass-bg rounded-3xl p-8 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📈</span> Crescimento de Membros
        </h2>
        
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={dados}>
                <defs>
                  <linearGradient id="colorMembros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mes" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="membros" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMembros)" 
                />
              </AreaChart>
            ) : (
              <LineChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mes" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="membros" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-bg rounded-3xl p-8 mt-8 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📋</span> Dados Mensais
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Mês</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Membros</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Receita</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Crescimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dados.map((d, i) => {
                const prevMembros = i > 0 ? dados[i - 1].membros : d.membros;
                const cresc = i > 0 ? Math.round(((d.membros - prevMembros) / prevMembros) * 100) : 0;
                return (
                  <tr key={d.mes} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-semibold text-white">{d.mes}</td>
                    <td className="px-4 py-3 text-right text-cyan-400">{d.membros}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">R$ {(d.receita || 0).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-right">
                      {i > 0 && (
                        <span className={cresc >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {cresc >= 0 ? '+' : ''}{cresc}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
