
export interface CadastroForm {
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  senha: string;
  patrocinador_1: string;
  patrocinador_2: string;
  patrocinador_3: string;
}

const BASE = "http://localhost:8000";

export async function login(email: string, senha: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return true;
}

export async function cadastrar(form: CadastroForm) {
  const res = await fetch(`${BASE}/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
  return res.ok;
}

export async function getUser() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return null;

  return res.json();
}
