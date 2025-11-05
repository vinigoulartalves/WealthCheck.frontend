import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const features = [
  {
    title: "Monitoramento em tempo real",
    description:
      "Integrações bancárias seguras para consolidar contas, cartões e investimentos em uma única visão clara.",
  },
  {
    title: "Insights inteligentes",
    description:
      "Alertas personalizados, metas de economia e recomendações de carteira baseadas no seu perfil de risco.",
  },
  {
    title: "Experiência multicanal",
    description:
      "Acompanhe seu patrimônio em qualquer dispositivo com dashboards intuitivos e relatórios compartilháveis.",
  },
];

const benefits = [
  {
    label: "+48%",
    description: "usuários aumentaram a capacidade de investimento em 3 meses.",
  },
  {
    label: "12 mil",
    description: "objetivos financeiros acompanhados em tempo real.",
  },
  {
    label: "99,9%",
    description: "de disponibilidade com infraestrutura de nível bancário.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute left-1/4 top-40 h-52 w-52 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="absolute right-1/5 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pb-24 pt-16 text-center md:flex-row md:items-start md:text-left">
            <div className="flex-1 space-y-8">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                Confiança para investir melhor
              </span>
              <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Descomplique sua jornada financeira com a WealthCheck.
              </h2>
              <p className="max-w-xl text-lg text-white/70">
                Uma plataforma inteligente que conecta todas as suas contas, traz previsões assertivas e mostra exatamente onde investir para alcançar seus objetivos.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="group relative overflow-hidden rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-950 transition hover:bg-emerald-300">
                  Começar agora
                </button>
                <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:border-emerald-300 hover:text-emerald-200">
                  Ver planos
                </button>
              </div>
              <div className="flex items-center gap-8 text-left text-sm text-white/60">
                <div>
                  <p className="text-2xl font-semibold text-white">R$ 12 bi+</p>
                  <p>em patrimônio monitorado diariamente.</p>
                </div>
                <div className="hidden h-12 w-px bg-white/10 sm:block" />
                <div>
                  <p className="text-2xl font-semibold text-white">4.9/5</p>
                  <p>de satisfação média entre clientes corporativos.</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur">
                <div className="absolute -right-8 -top-8 hidden h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-30 blur-2xl md:block" />
                <div className="absolute -bottom-8 left-10 hidden h-28 w-28 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-400 opacity-30 blur-2xl md:block" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-300">
                      Dashboards
                    </span>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">
                      Tempo real
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <Image
                      src="/window.svg"
                      alt="Painel da WealthCheck exibindo performance de carteira"
                      width={480}
                      height={320}
                      className="rounded-xl border border-white/5"
                    />
                  </div>
                  <p className="text-sm text-white/60">
                    Visualize projeções de fluxo de caixa, diversificação de ativos e performance histórica com indicadores comparativos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-950/60 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Por que WealthCheck?
              </span>
              <h3 className="text-3xl font-semibold sm:text-4xl">
                Tudo o que você precisa para crescer com segurança.
              </h3>
              <p className="mx-auto max-w-2xl text-base text-white/70">
                Uma combinação poderosa de dados, automação e experiência para transformar a gestão do seu patrimônio em resultados.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 via-slate-900/40 to-slate-950/60 p-8 text-left shadow-lg shadow-emerald-500/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-400/30"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-300">
                    <span>•</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:items-end md:gap-16">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Resultados reais
              </span>
              <h3 className="text-3xl font-semibold sm:text-4xl">
                Transparência e performance para você atingir suas metas.
              </h3>
              <p className="text-base text-white/70">
                Nosso motor de análise identifica oportunidades e riscos para que você ajuste sua carteira e tenha previsibilidade de caixa.
              </p>
              <a
                href="#insights"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300 transition hover:text-emerald-200"
              >
                Conheça os insights
                <span aria-hidden>→</span>
              </a>
            </div>
            <div className="flex flex-1 flex-col gap-6 md:flex-row">
              {benefits.map((benefit) => (
                <div
                  key={benefit.label}
                  className="flex-1 rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-lg shadow-black/30"
                >
                  <p className="text-4xl font-semibold text-emerald-300">{benefit.label}</p>
                  <p className="mt-2 text-sm text-white/60">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="bg-slate-950/70 py-24">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                Insights exclusivos
              </span>
              <h3 className="text-3xl font-semibold sm:text-4xl">
                Relatórios dinâmicos e recomendações baseadas em dados confiáveis.
              </h3>
              <p className="text-base text-white/70">
                Configure alertas automáticos, receba análises semanais e compare seu desempenho com benchmarks do mercado.
              </p>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Insights preditivos para rebalancear sua carteira no momento certo.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Simulações de cenários considerando objetivos de curto e longo prazo.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Painéis colaborativos para compartilhar estratégias com o seu assessor.
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-emerald-500/10 backdrop-blur">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">Radar de oportunidades</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Seus próximos passos sugeridos</p>
                  </div>
                  <div className="space-y-4 text-sm text-white/80">
                    <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/60 p-4">
                      <p className="text-emerald-300">Aumente a reserva de emergência</p>
                      <p className="mt-1 text-white/60">Invista 5% a mais em renda fixa para proteger sua liquidez.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-emerald-300">Rebalanceie sua carteira</p>
                      <p className="mt-1 text-white/60">Reduza 3% de ações internacionais e aumente fundos multimercado.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-emerald-300">Otimize custos</p>
                      <p className="mt-1 text-white/60">Negocie taxas com gestores para manter o custo total abaixo de 1.2%.</p>
                    </div>
                  </div>
                  <button className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:border-emerald-400 hover:text-emerald-200">
                    Receber demonstração
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
