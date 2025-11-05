export interface Despesa {
  id?: number | string;
  idUsuario: number;
  valor: number;
  data: string;
  descricao: string;
  categoria: string;
}
