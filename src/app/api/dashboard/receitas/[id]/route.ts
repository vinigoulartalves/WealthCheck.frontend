import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

function sanitizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function buildRemoteUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  return `${sanitizeBaseUrl(API_BASE_URL)}${path}`;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Identificador da receita não informado." }, { status: 400 });
  }

  try {
    const response = await fetch(buildRemoteUrl(`/receitas/${encodeURIComponent(id)}`), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Falha ao consultar receita na API remota.", response.status, response.statusText);
      return NextResponse.json({ error: "Não foi possível carregar a receita." }, { status: response.status });
    }

    const receita = await response.json();

    return NextResponse.json({ receita });
  } catch (error) {
    console.error("Erro inesperado ao consultar receita.", error);
    return NextResponse.json({ error: "Não foi possível carregar a receita." }, { status: 502 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Identificador da receita não informado." }, { status: 400 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Falha ao interpretar o corpo da requisição de atualização de receita.", error);
    return NextResponse.json({ error: "Formato de requisição inválido." }, { status: 400 });
  }

  if (typeof body.idUsuario !== "number" && typeof body.idUsuario !== "string") {
    return NextResponse.json({ error: "Informe o usuário vinculado à receita." }, { status: 400 });
  }

  try {
    const response = await fetch(buildRemoteUrl(`/receitas/${encodeURIComponent(id)}`), {
      method: "PUT",
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
        console.error("Falha ao interpretar a resposta da atualização de receita.", error);
      }
    }

    if (!response.ok) {
      console.error("Falha ao atualizar receita na API remota.", response.status, response.statusText, payload);
      return NextResponse.json(
        {
          error: (payload as { error?: string } | null)?.error ?? "Não foi possível atualizar a receita.",
        },
        { status: response.status === 422 ? 422 : response.status },
      );
    }

    const status = response.status === 204 ? 200 : response.status;

    return NextResponse.json(payload ?? { sucesso: true }, { status });
  } catch (error) {
    console.error("Erro inesperado ao atualizar receita.", error);
    return NextResponse.json({ error: "Não foi possível atualizar a receita." }, { status: 502 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Identificador da receita não informado." }, { status: 400 });
  }

  try {
    const response = await fetch(buildRemoteUrl(`/receitas/${encodeURIComponent(id)}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch (error) {
        console.error("Falha ao interpretar a resposta de exclusão de receita.", error);
      }

      console.error("Falha ao excluir receita na API remota.", response.status, response.statusText, payload);
      return NextResponse.json(
        { error: (payload as { error?: string } | null)?.error ?? "Não foi possível excluir a receita." },
        { status: response.status },
      );
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error("Erro inesperado ao excluir receita.", error);
    return NextResponse.json({ error: "Não foi possível excluir a receita." }, { status: 502 });
  }
}
