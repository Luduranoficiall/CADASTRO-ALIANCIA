"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Membro {
  id?: string;
  nome: string;
}

interface TreeNode {
  name: string;
  level: string;
  children: TreeNode[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RedeVisual({ params }: PageProps) {
  const { id } = use(params);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const loadTree = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rede/${id}`);
        const data = await res.json();
        
        setTreeData({
          name: `Você (#${id})`,
          level: "root",
          children: [
            {
              name: "Nível 1",
              level: "level1",
              children: (data.nivel1 || []).map((u: Membro) => ({ 
                name: u.nome,
                level: "member",
                children: []
              }))
            },
            {
              name: "Nível 2",
              level: "level2",
              children: (data.nivel2 || []).map((u: Membro) => ({ 
                name: u.nome,
                level: "member",
                children: []
              }))
            },
            {
              name: "Nível 3",
              level: "level3",
              children: (data.nivel3 || []).map((u: Membro) => ({ 
                name: u.nome,
                level: "member",
                children: []
              }))
            }
          ]
        });
      } catch (error) {
        console.error("Erro ao carregar árvore:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTree();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando visualização...</p>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "root": return "from-amber-500 to-orange-600";
      case "level1": return "from-cyan-500 to-blue-600";
      case "level2": return "from-blue-500 to-purple-600";
      case "level3": return "from-purple-500 to-pink-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isSelected = selectedNode === node.name;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.name} className="flex flex-col items-center">
        <button
          onClick={() => setSelectedNode(isSelected ? null : node.name)}
          className={`relative px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
            isSelected 
              ? 'scale-110 shadow-lg' 
              : 'hover:scale-105'
          } ${
            node.level === 'member' 
              ? 'bg-white/10 border-white/20 hover:border-cyan-500/50' 
              : `bg-gradient-to-br ${getLevelColor(node.level)} border-transparent shadow-lg`
          }`}
        >
          <span className={`font-semibold ${node.level === 'member' ? 'text-gray-300' : 'text-white'}`}>
            {node.name}
          </span>
          {hasChildren && node.level !== 'member' && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-bold">
              {node.children.length}
            </span>
          )}
        </button>
        
        {hasChildren && (
          <div className="relative mt-4">
            {/* Vertical line */}
            <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-white/20"></div>
            
            {/* Horizontal line */}
            {node.children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20" style={{ width: `${Math.min(node.children.length * 120, 600)}px`, marginLeft: `calc(50% - ${Math.min(node.children.length * 60, 300)}px)` }}></div>
            )}
            
            <div className="flex gap-4 justify-center flex-wrap max-w-4xl">
              {node.children.map((child, i) => (
                <div key={i} className="relative pt-4">
                  {/* Vertical line to child */}
                  <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-white/20"></div>
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-8">
      {/* Header */}
      <div className="glass-bg rounded-3xl p-6 mb-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-2xl">🌳</span>
          </div>
          <div>
            <h1 className="text-2xl font-black gradient-text">Visualização da Rede</h1>
            <p className="text-gray-400 text-sm">Membro #{id}</p>
          </div>
        </div>
        <Link
          href={`/rede/${id}`}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all flex items-center gap-2"
        >
          📋 Ver em Lista
        </Link>
      </div>

      {/* Tree Visualization */}
      <div className="glass-bg rounded-3xl p-8 border border-white/10 min-h-[60vh] overflow-auto">
        <div className="flex justify-center py-8">
          {treeData && renderNode(treeData)}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-bg rounded-2xl px-6 py-4 mt-6 border border-white/10">
        <p className="text-sm text-gray-400 mb-3">Legenda:</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-amber-500 to-orange-600"></span> 
            Você
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-blue-600"></span> 
            Nível 1 (Diretos)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-600"></span> 
            Nível 2
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-600"></span> 
            Nível 3
          </span>
        </div>
      </div>

      {/* Tip */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>💡 Clique nos nós para expandir e ver mais detalhes</p>
      </div>
    </div>
  );
}
