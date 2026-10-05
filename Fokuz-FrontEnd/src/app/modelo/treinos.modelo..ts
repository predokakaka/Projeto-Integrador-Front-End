import { ItemTreino } from "./itemTreino.modelo";

// RF_FF01 - Criar e gerenciar plano de treino
export interface Treino{
    id?:string,
    nome:string,
    UsuarioId:string,
    tipoTreino:string,
    dataInicio:string,
    dataFim:string,
    exercicios: ItemTreino[]
}
