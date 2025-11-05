"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginError {
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError({ message: "Informe email e senha para continuar." });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError({ message: payload?.error ?? "Não foi possível validar as credenciais." });
        return;
      }

      router.push("/dashboard");
    } catch (submissionError) {
      console.error("Falha ao enviar o formulário de login.", submissionError);
      setError({ message: "Não foi possível validar as credenciais no momento." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl shadow-emerald-500/10">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">WealthCheck</span>
            <h1 className="mt-4 text-3xl font-semibold">Acesse seu painel</h1>
            <p className="mt-2 text-sm text-white/60">Informe suas credenciais para acessar o painel financeiro.</p>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error.message}
            </div>
          ) : null}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="seuemail@exemplo.com"
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Senha
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Digite sua senha"
                disabled={isSubmitting}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 flex items-center justify-center overflow-hidden rounded-full border border-emerald-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200 transition duration-300 ease-out hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="h-2 w-2 animate-ping rounded-full bg-black" aria-hidden />
                    Validando...
                  </>
                ) : (
                  "Entrar"
                )}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/50">
            Esqueceu seus dados? Entre em contato com o administrador da sua conta.
          </p>
          <p className="mt-4 text-center text-xs text-white/50">
            <Link href="/" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
              Voltar para o início
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
