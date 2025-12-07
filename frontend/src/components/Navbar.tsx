"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    
    // Use setTimeout to defer state update
    const timeoutId = setTimeout(checkAuth, 0);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = isLoggedIn ? [
    { href: "/painel", label: "Dashboard", icon: "📊" },
    { href: "/rede-visual/1", label: "Rede", icon: "🌐" },
    { href: "/extrato", label: "Extrato", icon: "💰" },
    { href: "/pagar", label: "Pagamento", icon: "💳" },
    { href: "/ranking", label: "Ranking", icon: "🏆" },
    { href: "/perfil", label: "Perfil", icon: "👤" },
  ] : [
    { href: "/login", label: "Entrar", icon: "🔐" },
    { href: "/cadastro", label: "Cadastrar", icon: "✨" },
  ];

  return (
    <nav className="w-full py-4 px-4 sm:px-8 glass-bg border-b border-white/5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <Image 
            src="/logo-aliancia.svg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="h-10 w-10 relative z-10 drop-shadow-lg"
          />
        </div>
        <span className="text-2xl font-black tracking-tight gradient-text">
          ALIANCI.A
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2
              ${pathname === link.href 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        {isLoggedIn && (
          <>
            <Link 
              href="/admin" 
              className="px-4 py-2 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-2"
            >
              <span>⚙️</span>
              Admin
            </Link>
            <button 
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 transition-all flex items-center gap-2"
            >
              <span>🚪</span>
              Sair
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-bg border-b border-white/5 md:hidden animate-fade-in">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3
                  ${pathname === link.href 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400' 
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link 
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 flex items-center gap-3"
                >
                  <span className="text-lg">⚙️</span>
                  Admin
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-3 text-left"
                >
                  <span className="text-lg">🚪</span>
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
