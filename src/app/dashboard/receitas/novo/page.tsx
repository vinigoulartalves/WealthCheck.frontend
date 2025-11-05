import type { Metadata } from "next";
import CreateReceitaForm from "./create-receita-form";

export const metadata: Metadata = {
  title: "Nova receita",
  description: "Cadastre uma nova receita vinculada ao usuário logado.",
};

export default function CreateReceitaPage() {
  return <CreateReceitaForm />;
}

