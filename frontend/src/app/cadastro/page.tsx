"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cadastrar, CadastroForm } from "../../lib/api";
import { useToast } from "../../components/Toast";

// Validações
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let sum = 0, rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}
function validatePhone(phone: string) {
  return /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(phone);
}
function validatePassword(s: string) {
  return s.length >= 6;
}
function validateDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Componente de Input Premium
function PremiumInput({ 
  label, 
  icon, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false
}: {
  label: string;
  icon: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300">
        {icon} {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none transition-all duration-300
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
            }
            ${isPassword ? 'pr-12' : ''}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export default function CadastroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<CadastroForm>({
    nome: "",
    telefone: "",
    endereco: "",
    email: "",
    cpf: "",
    data_nascimento: "",
    senha: "",
    patrocinador_1: "",
    patrocinador_2: "",
    patrocinador_3: ""
  });
  
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CadastroForm | 'confirmarSenha', string>>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ref = localStorage.getItem("ref") || "";
      if (ref && form.patrocinador_1 !== ref) {
        setForm(f => ({ ...f, patrocinador_1: ref }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof CadastroForm>(key: K, value: CadastroForm[K]) {
    setForm({ ...form, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: undefined });
    }
  }

  function validateStep(stepNum: number): boolean {
    const newErrors: Partial<Record<keyof CadastroForm | 'confirmarSenha', string>> = {};
    
    if (stepNum === 1) {
      if (!form.nome.trim()) newErrors.nome = "Nome completo é obrigatório";
      if (!validateEmail(form.email)) newErrors.email = "E-mail inválido";
      if (!validatePhone(form.telefone)) newErrors.telefone = "Telefone inválido. Use: (99) 99999-9999";
    }
    
    if (stepNum === 2) {
      if (!validateCPF(form.cpf)) newErrors.cpf = "CPF inválido";
      if (!validateDate(form.data_nascimento)) newErrors.data_nascimento = "Data inválida";
      if (!form.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";
    }
    
    if (stepNum === 3) {
      if (!validatePassword(form.senha)) newErrors.senha = "Mínimo 6 caracteres";
      if (form.senha !== confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    setStep(step - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    if (!acceptTerms) {
      showToast("error", "Você precisa aceitar os termos de uso para continuar.");
      return;
    }
    
    setLoading(true);
    const ok = await cadastrar(form);
    setLoading(false);
    
    if (ok) {
      showToast("success", "🎉 Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      showToast("error", "Não foi possível concluir seu cadastro. Verifique os dados e tente novamente.");
    }
  }

  // Progress indicator
  const steps = [
    { num: 1, title: "Dados Pessoais", icon: "👤" },
    { num: 2, title: "Documentos", icon: "📋" },
    { num: 3, title: "Segurança", icon: "🔐" }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Card com Glass Effect */}
        <div className="glass-bg rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 mb-4 shadow-lg shadow-emerald-500/25">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-black gradient-text mb-2">
              Criar sua conta
            </h1>
            <p className="text-gray-400">
              Junte-se à comunidade ALIANCI.A
            </p>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => step > s.num && setStep(s.num)}
                  disabled={step < s.num}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                    ${step === s.num 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                      : step > s.num 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                >
                  <span>{step > s.num ? '✓' : s.icon}</span>
                  <span className="hidden sm:inline text-sm font-semibold">{s.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.num ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Dados Pessoais */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <PremiumInput
                  label="Nome Completo"
                  icon="👤"
                  value={form.nome}
                  onChange={(e) => update("nome", e.target.value)}
                  placeholder="Seu nome completo"
                  error={errors.nome}
                  required
                />
                <PremiumInput
                  label="E-mail"
                  icon="📧"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="seu@email.com"
                  error={errors.email}
                  required
                />
                <PremiumInput
                  label="Telefone"
                  icon="📱"
                  value={form.telefone}
                  onChange={(e) => update("telefone", e.target.value)}
                  placeholder="(99) 99999-9999"
                  error={errors.telefone}
                  required
                />
              </div>
            )}

            {/* Step 2: Documentos */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <PremiumInput
                  label="CPF"
                  icon="🆔"
                  value={form.cpf}
                  onChange={(e) => update("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  error={errors.cpf}
                  required
                />
                <PremiumInput
                  label="Data de Nascimento"
                  icon="📅"
                  type="date"
                  value={form.data_nascimento}
                  onChange={(e) => update("data_nascimento", e.target.value)}
                  error={errors.data_nascimento}
                  required
                />
                <PremiumInput
                  label="Endereço"
                  icon="🏠"
                  value={form.endereco}
                  onChange={(e) => update("endereco", e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  error={errors.endereco}
                  required
                />
              </div>
            )}

            {/* Step 3: Segurança */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <PremiumInput
                  label="Senha"
                  icon="🔐"
                  type="password"
                  value={form.senha}
                  onChange={(e) => update("senha", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  error={errors.senha}
                  required
                />
                <PremiumInput
                  label="Confirmar Senha"
                  icon="🔒"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => {
                    setConfirmarSenha(e.target.value);
                    if (errors.confirmarSenha) {
                      setErrors({ ...errors, confirmarSenha: undefined });
                    }
                  }}
                  placeholder="Repita sua senha"
                  error={errors.confirmarSenha}
                  required
                />
                
                {/* Patrocinadores */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <span>🤝</span> Patrocinadores (opcional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Nível 1</label>
                      <input
                        type="text"
                        value={form.patrocinador_1}
                        onChange={(e) => update("patrocinador_1", e.target.value)}
                        placeholder="ID do patrocinador"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Nível 2</label>
                      <input
                        type="text"
                        value={form.patrocinador_2}
                        onChange={(e) => update("patrocinador_2", e.target.value)}
                        placeholder="ID do patrocinador"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Nível 3</label>
                      <input
                        type="text"
                        value={form.patrocinador_3}
                        onChange={(e) => update("patrocinador_3", e.target.value)}
                        placeholder="ID do patrocinador"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    Li e aceito os{" "}
                    <Link href="/termos" className="text-cyan-400 hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link href="/privacidade" className="text-cyan-400 hover:underline">
                      Política de Privacidade
                    </Link>
                    . Seus dados são protegidos com criptografia AES-256.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 rounded-xl font-bold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  ← Voltar
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !acceptTerms}
                  className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      🚀 Finalizar Cadastro
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <span>🔒</span>
          <span>Seus dados são protegidos com criptografia de ponta a ponta</span>
        </div>
      </div>
    </div>
  );
}
