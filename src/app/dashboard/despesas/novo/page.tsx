import type { Metadata } from "next";
import CreateDespesaForm from "./create-despesa-form";

export const metadata: Metadata = {
  title: "Nova despesa",
  description: "Cadastre uma nova despesa vinculada ao usuário logado.",
};

export default function CreateDespesaPage() {
  return <CreateDespesaForm />;
}
