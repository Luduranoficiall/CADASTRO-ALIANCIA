"use client";

import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");

  async function pedirToken() {
    const res = await fetch("http://localhost:8000/reset-senha-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setToken(data.reset_token);
  }

  async function salvar() {
    const res = await fetch("http://localhost:8000/reset-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, senha })
    });

    if (res.ok) alert("Senha redefinida com sucesso! Agora é só fazer login com sua nova senha. 😊");
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-10 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-blue-900/40">
      <h1 className="text-3xl text-blue-500 mb-6 font-bold">Reset de Senha</h1>

      <Input label="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <Button onClick={pedirToken} className="mt-4">Pedir Token</Button>

      {token && (
        <>
          <Input label="Token" value={token} disabled />

          <Input
            label="Nova Senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <Button onClick={salvar} className="mt-4">Salvar Nova Senha</Button>
        </>
      )}
    </div>
  );
}
