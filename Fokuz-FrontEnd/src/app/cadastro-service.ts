import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../app/modelo/usuario.modelo';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  async salvar(cadastro: Usuario): Promise<Usuario> {
    const corpo = {
      nome: cadastro.nome,
      email: cadastro.email,
      senha: cadastro.senha,
      CPF: cadastro.cpf,
      telefone: cadastro.numero,
      altura: cadastro.altura,
      peso_atual: cadastro.pesoAtual,
      data_nascimento: cadastro.dataNascimento,
      sexo: cadastro.sexo,
    };

    const criado = await firstValueFrom(this.http.post<any>(this.apiUrl, corpo));

    return this.paraModelo(criado);
  }

  async obterTodos(): Promise<Usuario[]> {
    const lista = await firstValueFrom(this.http.get<any[]>(this.apiUrl));

    return lista.map((usuario) => this.paraModelo(usuario));
  }

  async excluir(cpf: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/cpf/${cpf}`));
  }

  async buscarPelaChavePrimaria(cpf: string): Promise<Usuario[]> {
    const lista = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/pesquisar`, { params: { cpf } }),
    );

    return lista.map((usuario) => this.paraModelo(usuario));
  }

  async buscarPeloNome(nome: string): Promise<Usuario[]> {
    const lista = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/pesquisar`, { params: { nome } }),
    );

    return lista.map((usuario) => this.paraModelo(usuario));
  }

  async alterar(usuario: Usuario): Promise<Usuario> {
    const corpo = {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      telefone: usuario.numero,
      altura: usuario.altura,
      peso_atual: usuario.pesoAtual,
      data_nascimento: usuario.dataNascimento,
      sexo: usuario.sexo,
    };

    const atualizado = await firstValueFrom(
      this.http.put<any>(`${this.apiUrl}/cpf/${usuario.cpf}`, corpo),
    );

    return this.paraModelo(atualizado);
  }

  async obterPeloCpf(cpf: string): Promise<Usuario> {
    const usuario = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/cpf/${cpf}`));

    return this.paraModelo(usuario);
  }

  private paraModelo(usuario: any): Usuario {
    return {
      id: usuario.id?.toString(),
      nome: usuario.nome,
      cpf: usuario.CPF,
      email: usuario.email,
      numero: usuario.telefone,
      altura: usuario.altura,
      pesoAtual: usuario.peso_atual,
      dataNascimento: usuario.data_nascimento,
      sexo: usuario.sexo,
    };
  }
}
