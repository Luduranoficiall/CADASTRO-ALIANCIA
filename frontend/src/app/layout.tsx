import "./globals.css";
import "./toast.css";
import { ToastProvider } from "../components/Toast";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "ALIANCIA — Cadastro Premium",
  description: "Sistema profissional de 3 níveis da ALIANCI.A",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "ALIANCIA — Cadastro Premium",
    description: "Sistema multinível premium, seguro e escalável.",
    url: "https://aliancia.com/",
    siteName: "ALIANCIA",
    images: [
      {
        url: "/logo-aliancia.svg",
        width: 1200,
        height: 630,
        alt: "Logo ALIANCI.A"
      }
    ],
    locale: "pt_BR",
    type: "website"
  }
};

function Footer() {
  return (
    <footer className="w-full py-8 px-8 glass-bg border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💜</span>
            <span className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="gradient-text font-bold">ALIANCI.A</span> — Todos os direitos reservados.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/sobre" className="text-gray-400 hover:text-cyan-400 transition-colors">Sobre</a>
            <a href="/termos" className="text-gray-400 hover:text-cyan-400 transition-colors">Termos</a>
            <a href="/privacidade" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacidade</a>
            <a href="/contato" className="text-gray-400 hover:text-cyan-400 transition-colors">Contato</a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span>🔒</span>
          <span>Protegido com criptografia AES-256 | LGPD & GDPR Compliant</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/icon.png" />
        <meta name="description" content="Sistema profissional de cadastro e pagamento Pix da ALIANCI.A. Seguro, rápido e humanizado." />
        <meta property="og:title" content="ALIANCIA — Cadastro Premium" />
        <meta property="og:description" content="Sistema multinível premium, seguro e escalável." />
        <meta property="og:image" content="/logo-aliancia.svg" />
        <meta property="og:url" content="https://aliancia.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ALIANCIA — Cadastro Premium" />
        <meta name="twitter:description" content="Sistema multinível premium, seguro e escalável." />
        <meta name="twitter:image" content="/logo-aliancia.svg" />
        <title>ALIANCIA — Cadastro Premium</title>
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white font-sans">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-0">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
