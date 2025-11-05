import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

function sanitizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function buildRemoteUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  return `${sanitizeBaseUrl(API_BASE_URL)}${path}`;
}

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("idUsuario");

  const query = userId ? `?idUsuario=${encodeURIComponent(userId)}` : "";

  try {
    const response = await fetch(buildRemoteUrl(`/receitas${query}`), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Falha ao consultar receitas na API remota.", response.status, response.statusText);
      return NextResponse.json({ error: "Não foi possível carregar as receitas." }, { status: 502 });
    }

    const payload = (await response.json()) as unknown;

    const receitas = extractReceitasList(payload);

    if (!receitas) {
      console.error("Estrutura inesperada recebida da API de receitas.", payload);
      return NextResponse.json({ error: "Não foi possível carregar as receitas." }, { status: 502 });
    }

    if (!userId) {
      return NextResponse.json({ receitas, origem: payload });
    }

    const numericUserId = Number(userId);

    if (!Number.isFinite(numericUserId)) {
      return NextResponse.json({ error: "Identificador de usuário inválido." }, { status: 400 });
    }

    const filteredReceitas = receitas.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidateUserId = (item as { idUsuario?: unknown }).idUsuario;

      if (typeof candidateUserId === "number") {
        return candidateUserId === numericUserId;
      }

      if (typeof candidateUserId === "string") {
        const parsed = Number(candidateUserId.trim());
        return Number.isFinite(parsed) && parsed === numericUserId;
      }

      return false;
    });

    return NextResponse.json({ receitas: filteredReceitas, origem: payload });
  } catch (error) {
    console.error("Erro inesperado ao consultar receitas.", error);
    return NextResponse.json({ error: "Não foi possível carregar as receitas." }, { status: 502 });
  }
}

function extractReceitasList(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const container = payload as Record<string, unknown>;

    const possibleKeys = ["receitas", "data", "items", "content"];

    for (const key of possibleKeys) {
      const value = container[key];

      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Falha ao interpretar o corpo da requisição de criação de receita.", error);
    return NextResponse.json({ error: "Formato de requisição inválido." }, { status: 400 });
  }

  if (typeof body.idUsuario !== "number" && typeof body.idUsuario !== "string") {
    return NextResponse.json({ error: "Informe o usuário vinculado à receita." }, { status: 400 });
  }

  try {
    const response = await fetch(buildRemoteUrl("/receitas"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let payload: unknown = null;

    if (response.status !== 204) {
      try {
        payload = await response.json();
      } catch (error) {
        console.error("Falha ao interpretar a resposta da criação de receita.", error);
      }
    }

    if (!response.ok) {
      console.error("Falha ao criar receita na API remota.", response.status, response.statusText, payload);
      return NextResponse.json(
        {
          error: (payload as { error?: string } | null)?.error ?? "Não foi possível criar a receita.",
        },
        { status: response.status === 422 ? 422 : 502 },
      );
    }

    const status = response.status === 204 ? 200 : response.status;

    return NextResponse.json(payload ?? { sucesso: true }, { status });
  } catch (error) {
    console.error("Erro inesperado ao criar receita.", error);
    return NextResponse.json({ error: "Não foi possível criar a receita." }, { status: 502 });
  }
}
