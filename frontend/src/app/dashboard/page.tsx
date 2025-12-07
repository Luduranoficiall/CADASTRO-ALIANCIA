export default function Dashboard() {
  return (
    <div className="w-full max-w-6xl p-12 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl shadow-blue-900/40">
      <h1 className="text-4xl font-bold text-blue-500 mb-10">Dashboard ALIANCI.A</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-xl">
          <h2 className="text-blue-400 text-xl font-bold mb-4">Total de Membros</h2>
          <p className="text-3xl">—</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-xl">
          <h2 className="text-blue-400 text-xl font-bold mb-4">Indicados Diretos</h2>
          <p className="text-3xl">—</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-xl">
          <h2 className="text-blue-400 text-xl font-bold mb-4">Rede Total (3 níveis)</h2>
          <p className="text-3xl">—</p>
        </div>
      </div>
    </div>
  );
}
