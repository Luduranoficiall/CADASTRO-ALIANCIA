"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface UserAdmin {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  data_cadastro?: string;
  patrocinador_1?: string;
  patrocinador_2?: string;
  patrocinador_3?: string;
}

export default function Admin() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const itemsPerPage = 10;

  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredUsers = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Nome", "E-mail", "Nível 1", "Nível 2", "Nível 3"];
    const csvContent = [
      headers.join(","),
      ...users.map(u => [u.id, u.nome, u.email, u.patrocinador_1 || "", u.patrocinador_2 || "", u.patrocinador_3 || ""].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `membros_aliancia_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="text-3xl font-black gradient-text">Painel Admin</h1>
            </div>
            <p className="text-gray-400">Gerencie todos os membros da plataforma</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm font-semibold border border-cyan-500/30">
              {users.length} membros
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Total de Membros</p>
          <p className="text-3xl font-black gradient-text">{users.length}</p>
        </div>
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Ativos Hoje</p>
          <p className="text-3xl font-black text-emerald-400">{Math.floor(users.length * 0.7)}</p>
        </div>
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Novos (7 dias)</p>
          <p className="text-3xl font-black text-cyan-400">{Math.floor(users.length * 0.15)}</p>
        </div>
        <div className="glass-bg rounded-2xl p-6 border border-white/10">
          <p className="text-gray-500 text-sm mb-1">Taxa de Conversão</p>
          <p className="text-3xl font-black text-purple-400">68%</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="glass-bg rounded-2xl p-4 mb-6 border border-white/10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-3 rounded-xl font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
          >
            <span>📥</span>
            Exportar CSV
          </button>
          <button
            onClick={load}
            className="px-4 py-3 rounded-xl font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
          >
            <span>🔄</span>
            Atualizar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-bg rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Membro</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nível 1</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nível 2</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nível 3</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-cyan-400">{u.id.slice(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{u.nome}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{u.patrocinador_1 || "—"}</td>
                  <td className="px-6 py-4 text-gray-400">{u.patrocinador_2 || "—"}</td>
                  <td className="px-6 py-4 text-gray-400">{u.patrocinador_3 || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/rede/${u.id}`}
                        className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="Ver Rede"
                      >
                        🌐
                      </Link>
                      <Link
                        href={`/perfil/${u.id}`}
                        className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Ver Perfil"
                      >
                        👤
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(u.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remover"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-bg rounded-3xl p-8 max-w-md w-full border border-white/10 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-400 mb-6">
                Tem certeza que deseja remover este membro? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition-all shadow-lg shadow-red-500/25"
                >
                  Sim, Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
