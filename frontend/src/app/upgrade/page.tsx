"use client";

import Button from "../../components/Button";

export default function Upgrade() {
  return (
    <div className="max-w-lg mx-auto mt-20 p-10 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-blue-900/40">
      <h1 className="text-4xl text-blue-500 font-bold mb-8">Upgrade ALIANCI.A</h1>

      <p className="text-neutral-300 mb-6 text-lg">
        Torne-se membro ALIANCI.A premium por <b>R$ 197/mês</b>  
        e desbloqueie sua rede de 3 níveis + benefícios exclusivos.
      </p>

      <Button onClick={() => alert("Para fazer upgrade, realize o pagamento via Pix Nubank e envie o comprovante na tela de pagamento. Qualquer dúvida, nosso time está pronto para ajudar você a evoluir! 🚀")}>Fazer Upgrade</Button>
    </div>
  );
}
