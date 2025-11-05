import Link from "next/link";

const expenseBuckets = [
  {
    name: "Operações",
    amount: "R$ 148.300",
    change: "-3%",
    description: "Custos de processamento, infraestrutura em nuvem e licenças de ferramentas críticas.",
  },
  {
    name: "Aquisição de clientes",
    amount: "R$ 96.500",
    change: "+6%",
    description: "Investimentos em mídia paga, eventos e programa de indicações com parceiros.",
  },
  {
    name: "Pessoal",
    amount: "R$ 212.750",
    change: "+2%",
    description: "Folha de pagamento, benefícios estratégicos e capacitação do time de especialistas.",
  },
];

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Despesas</p>
            <h1 className="mt-2 text-3xl font-semibold">Controle inteligente de gastos</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Identifique aumentos fora da curva e acompanhe o impacto de otimizações para manter a rentabilidade em alta.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <div className="mt-12 grid gap-6">
          {expenseBuckets.map((bucket) => (
            <article key={bucket.name} className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                    Categoria
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{bucket.name}</h2>
                  <p className="mt-2 text-sm text-white/70">{bucket.description}</p>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Total do mês</span>
                  <strong className="mt-2 text-3xl text-white">{bucket.amount}</strong>
                  <span className={`mt-1 text-xs font-semibold uppercase tracking-[0.3em] ${bucket.change.startsWith("-") ? "text-emerald-300" : "text-rose-300"}`}>
                    {bucket.change} vs. mês anterior
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
