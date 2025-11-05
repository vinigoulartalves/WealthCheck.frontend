"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Receita } from "@/interfaces/receita.interface";
import { extractUserId, loadCurrentUser, type StoredUser } from "@/lib/user-storage";

interface EditPageProps {
  params: {
    id: string;
  };
}

interface FormState {
  valor: string;
  data: string;
  descricao: string;
  categoria: string;
}

function normalizeReceita(raw: unknown): Receita | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as {
    id?: unknown;
    idUsuario?: unknown;
    valor?: unknown;
    data?: unknown;
    descricao?: unknown;
    categoria?: unknown;
  };

  const numericId =
    typeof candidate.id === "number"
      ? candidate.id
      : typeof candidate.id === "string"
        ? Number(candidate.id)
        : undefined;

  const numericUserId =
    typeof candidate.idUsuario === "number"
      ? candidate.idUsuario
      : typeof candidate.idUsuario === "string"
        ? Number(candidate.idUsuario)
        : null;

  const numericValor =
    typeof candidate.valor === "number"
      ? candidate.valor
      : typeof candidate.valor === "string"
        ? Number(candidate.valor.replace(/\./g, "").replace(",", "."))
        : null;

  if (!Number.isFinite(numericUserId) || !Number.isFinite(numericValor)) {
    return null;
  }

  return {
    id: Number.isFinite(numericId) ? (numericId as number) : undefined,
    idUsuario: numericUserId as number,
    valor: numericValor as number,
    data: typeof candidate.data === "string" ? candidate.data : "",
    descricao: typeof candidate.descricao === "string" ? candidate.descricao : "",
    categoria: typeof candidate.categoria === "string" ? candidate.categoria : "",
  };
}

function normalizeValorInput(value: string) {
  return value.replace(/[^\d.,-]/g, "");
}

function parseValor(value: string) {
  if (!value) {
    return Number.NaN;
  }

  const sanitized = value.replace(/\./g, "").replace(",", ".");

  return Number(sanitized);
}

function toDateInputValue(value: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 10);
}

export default function EditReceitaPage({ params }: EditPageProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isLoadingReceita, setIsLoadingReceita] = useState(true);
  const [currentReceita, setCurrentReceita] = useState<Receita | null>(null);
  const [formState, setFormState] = useState<FormState>({ valor: "", data: "", descricao: "", categoria: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentUser(loadCurrentUser());
    setIsUserLoaded(true);
  }, []);

  const userId = useMemo(() => extractUserId(currentUser), [currentUser]);

  useEffect(() => {
    async function fetchReceita() {
      setIsLoadingReceita(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/receitas/${params.id}`);
        const payload = (await response.json()) as { receita?: unknown; error?: string };

        if (!response.ok) {
          setError(payload?.error ?? "Não foi possível carregar a receita selecionada.");
          return;
        }

        const normalized = normalizeReceita(payload?.receita);

        if (!normalized) {
          setError("Receita não encontrada.");
          return;
        }

        setCurrentReceita(normalized);
        setFormState({
          valor: normalized.valor.toString(),
          data: toDateInputValue(normalized.data),
          descricao: normalized.descricao,
          categoria: normalized.categoria,
        });
      } catch (loadError) {
        console.error("Falha ao carregar receita.", loadError);
        setError("Não foi possível carregar a receita selecionada.");
      } finally {
        setIsLoadingReceita(false);
      }
    }

    if (params?.id) {
      void fetchReceita();
    }
  }, [params?.id]);

  function handleChange(field: keyof FormState) {
    return (event: FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const value = field === "valor" ? normalizeValorInput(target.value) : target.value;

      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!userId) {
      setError("Não foi possível identificar o usuário logado. Faça login novamente.");
      return;
    }

    const receitaId = currentReceita?.id ?? Number(params.id);

    if (!Number.isFinite(receitaId)) {
      setError("Identificador da receita inválido.");
      return;
    }

    const trimmedDescricao = formState.descricao.trim();
    const trimmedCategoria = formState.categoria.trim();
    const trimmedDate = formState.data.trim();
    const parsedValor = parseValor(formState.valor);

    if (!trimmedDate) {
      setError("Informe a data da receita.");
      return;
    }

    if (!Number.isFinite(parsedValor)) {
      setError("Informe um valor válido para a receita.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/receitas/${receitaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario: userId,
          valor: parsedValor,
          data: trimmedDate,
          descricao: trimmedDescricao,
          categoria: trimmedCategoria,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload?.error ?? "Não foi possível atualizar a receita.");
        return;
      }

      router.push("/dashboard/receitas");
    } catch (updateError) {
      console.error("Falha ao atualizar receita.", updateError);
      setError("Não foi possível atualizar a receita.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Editar receita</p>
            <h1 className="mt-2 text-3xl font-semibold">Atualize a entrada</h1>
            <p className="mt-3 text-sm text-white/60">
              Ajuste os dados da receita para manter o histórico financeiro sempre atualizado.
            </p>
          </div>
          <Link
            href="/dashboard/receitas"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            ← Voltar
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        ) : null}

        {!isUserLoaded ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Carregando dados do usuário...
          </div>
        ) : !userId ? (
          <div className="mt-12 rounded-3xl border border-amber-500/30 bg-amber-500/10 px-6 py-10 text-center text-sm text-amber-100">
            Faça login para editar receitas.
          </div>
        ) : isLoadingReceita ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Carregando dados da receita...
          </div>
        ) : !currentReceita ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Receita não encontrada.
          </div>
        ) : (
          <form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Valor
              <input
                type="text"
                inputMode="decimal"
                value={formState.valor}
                onInput={handleChange("valor")}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="0,00"
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Data
              <input
                type="date"
                value={formState.data}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    data: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Descrição
              <input
                type="text"
                value={formState.descricao}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    descricao: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Ex.: Salário mensal"
                disabled={isSubmitting}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              Categoria
              <input
                type="text"
                value={formState.categoria}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    categoria: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Ex.: Salário"
                disabled={isSubmitting}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-4 flex items-center justify-center overflow-hidden rounded-full border border-emerald-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200 transition duration-300 ease-out hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="h-2 w-2 animate-ping rounded-full bg-black" aria-hidden />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
