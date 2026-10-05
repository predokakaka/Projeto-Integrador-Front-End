import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemTreino } from './modelo/itemTreino.modelo';
import { Treino } from './modelo/treinos.modelo.';

@Injectable({
  providedIn: 'root',
})
export class TreinoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/treinos`;

  async listarPorUsuario(usuarioId: string): Promise<Treino[]> {
    const planos = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`),
    );

    return planos.map((plano) => this.paraModelo(plano));
  }

  async buscar(id: string): Promise<Treino> {
    const plano = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));

    return this.paraModelo(plano);
  }

  async cadastrar(treino: Treino): Promise<Treino> {
    const corpo = {
      usuario_id: Number(treino.UsuarioId),
      nome: treino.nome,
      tipo_treino: treino.tipoTreino,
      data_inicio: treino.dataInicio,
      data_fim: treino.dataFim,
      itens: treino.exercicios.map((item) => ({
        exercicio_id: Number(item.exercicioID),
        series: item.series,
        repeticoes: item.repeticoes,
        carga: item.carga,
        tempo_descanso: item.descanso,
      })),
    };

    const criado = await firstValueFrom(this.http.post<any>(this.apiUrl, corpo));

    return this.paraModelo(criado);
  }

  async alterar(treino: Treino): Promise<Treino> {
    const corpo = {
      usuario_id: Number(treino.UsuarioId),
      nome: treino.nome,
      tipo_treino: treino.tipoTreino,
      data_inicio: treino.dataInicio,
      data_fim: treino.dataFim,
      itens: treino.exercicios.map((item) => ({
        exercicio_id: Number(item.exercicioID),
        series: item.series,
        repeticoes: item.repeticoes,
        carga: item.carga,
        tempo_descanso: item.descanso,
      })),
    };

    const atualizado = await firstValueFrom(
      this.http.put<any>(`${this.apiUrl}/${treino.id}`, corpo),
    );

    return this.paraModelo(atualizado);
  }

  async excluir(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  private paraModelo(plano: any): Treino {
    const exercicios: ItemTreino[] = (plano.itens ?? []).map((item: any) => ({
      exercicioID: item.exercicio.id.toString(),
      series: item.series,
      repeticoes: item.repeticoes,
      carga: item.carga,
      descanso: item.tempo_descanso,
    }));

    return {
      id: plano.id.toString(),
      nome: plano.nome,
      UsuarioId: plano.usuario ? plano.usuario.id.toString() : '',
      tipoTreino: plano.tipo_treino,
      dataInicio: plano.data_inicio,
      dataFim: plano.data_fim,
      exercicios,
    };
  }
}
