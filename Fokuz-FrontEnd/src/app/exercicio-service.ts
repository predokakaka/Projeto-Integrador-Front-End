import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { exercicios } from './modelo/exercicio.modelo';

@Injectable({
  providedIn: 'root',
})
export class ExercicioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/exercicios`;

  async listar(): Promise<exercicios[]> {
    const lista = await firstValueFrom(this.http.get<any[]>(this.apiUrl));

    return lista.map((exercicio) => this.paraModelo(exercicio));
  }

  async cadastrar(exercicio: exercicios): Promise<exercicios> {
    const corpo = {
      nome: exercicio.nome,
      codigo: exercicio.codigo,
      grupo_muscular: exercicio.grupoMuscular,
      descricao: exercicio.descricao,
    };

    const criado = await firstValueFrom(this.http.post<any>(this.apiUrl, corpo));

    return this.paraModelo(criado);
  }

  private paraModelo(exercicio: any): exercicios {
    return {
      id: exercicio.id.toString(),
      nome: exercicio.nome,
      codigo: exercicio.codigo,
      grupoMuscular: exercicio.grupo_muscular,
      descricao: exercicio.descricao,
    };
  }
}
