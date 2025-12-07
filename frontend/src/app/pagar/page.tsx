"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useToast } from "../../components/Toast";

export default function Pagar() {
  const [file, setFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // TODO: obter user_id real do contexto/login
  const user_id = 1;
  const pixKey = "12.345.678/0001-99";

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("success", "Chave Pix copiada!");
  };

  async function enviarComprovante() {
    if (!file) {
      showToast("error", "Por favor, selecione o arquivo do comprovante.");
      fileInputRef.current?.focus();
      return;
    }
    
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      showToast("error", "Formato não suportado. Envie PNG, JPG ou PDF.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Arquivo muito grande. O limite é 5MB.");
      return;
    }
    
    setEnviando(true);
    const form = new FormData();
    form.append("user_id", String(user_id));
    form.append("file", file);
    
    try {
      const res = await fetch("/api/comprovante-pix", {
        method: "POST",
        body: form,
      });
      
      if (res.ok) {
        setSuccess(true);
        showToast("success", "Comprovante enviado com sucesso! 🎉");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        showToast("error", "Não conseguimos enviar seu comprovante. Tente novamente.");
      }
    } catch {
      showToast("error", "Erro de conexão. Tente novamente.");
    }
    
    setEnviando(false);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-bg rounded-3xl p-12 max-w-md text-center border border-white/10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-black gradient-text mb-4">Pagamento Recebido!</h2>
          <p className="text-gray-400 mb-6">
            Nosso time vai validar seu comprovante e liberar seu acesso em até 24 horas. 
            Você receberá um e-mail de confirmação!
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 rounded-xl font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
          >
            Enviar outro comprovante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card Principal */}
        <div className="glass-bg rounded-3xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4 shadow-lg shadow-purple-500/25">
              <span className="text-3xl">💳</span>
            </div>
            <h1 className="text-3xl font-black gradient-text mb-2">
              Pagamento Pix
            </h1>
            <p className="text-gray-400">
              Pague via Pix e envie o comprovante
            </p>
          </div>

          {/* Pix Info Card */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Valor:</span>
              <span className="text-2xl font-black text-emerald-400">R$ 97,00</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Banco:</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center text-xs">N</span>
                  Nubank
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Favorecido:</span>
                <span className="text-white">ALIANCI.A TECNOLOGIA LTDA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Chave (CNPJ):</span>
                <button
                  onClick={copyPixKey}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
                    ${copied 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                    }`}
                >
                  <span className="font-mono text-sm">{pixKey}</span>
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-2xl shadow-lg">
              <Image 
                src="/pix-nubank-qr.png" 
                alt="QR Code Pix" 
                width={180} 
                height={180} 
                className="w-44 h-44"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-sm">Após pagar</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-300">
              📎 Comprovante de Pagamento
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${file 
                  ? 'border-emerald-500/50 bg-emerald-500/10' 
                  : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                disabled={enviando}
              />
              
              {file ? (
                <div className="space-y-2">
                  <span className="text-3xl">✓</span>
                  <p className="text-emerald-400 font-semibold">{file.name}</p>
                  <p className="text-gray-500 text-xs">Clique para trocar o arquivo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-3xl">📤</span>
                  <p className="text-gray-400">Clique ou arraste o comprovante</p>
                  <p className="text-gray-600 text-xs">PNG, JPG ou PDF • Máx. 5MB</p>
                </div>
              )}
            </div>

            <button
              onClick={enviarComprovante}
              disabled={enviando || !file}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  🚀 Enviar Comprovante
                </>
              )}
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Dúvidas?{" "}
              <a href="mailto:suporte@aliancia.ai" className="text-cyan-400 hover:underline">
                Fale com o suporte
              </a>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <span>🔒</span>
          <span>Pagamento 100% seguro via Pix</span>
        </div>
      </div>
    </div>
  );
}
