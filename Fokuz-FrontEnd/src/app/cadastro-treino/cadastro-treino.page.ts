import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonText,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ExercicioService } from '../exercicio-service';
import { exercicios } from '../modelo/exercicio.modelo';
import { ItemTreino } from '../modelo/itemTreino.modelo';
import { Treino } from '../modelo/treinos.modelo.';
import { TreinoService } from '../treino-service';

@Component({
  selector: 'app-cadastro-treino',
  templateUrl: './cadastro-treino.page.html',
  styleUrls: ['./cadastro-treino.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonText,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
  ],
})
export class CadastroTreinoPage implements OnInit {
  // Usuário "logado". O app ainda não tem autenticação, então usamos um id
  // fixo por enquanto — troque aqui quando houver login de verdade, ou crie
  // um usuário com esse id no backend (ex: via POST /clientes) para testar.
  usuarioAtual = '1';

  exercicios: exercicios[] = [];
  treinosCadastrados: Treino[] = [];
  treinoSelecionado: Treino | null = null;

  // Tipos de rotina disponíveis para seleção (RF_FF01 - tipo de rotina).
  tiposTreino: string[] = [
    'Hipertrofia',
    'Força',
    'Resistência',
    'Emagrecimento',
    'Condicionamento Físico Geral',
  ];

  erroNome = false;
  erroTipoTreino = false;
  erroVigencia = false;
  erroExercicios = false;
  sucesso = false;
  mensagemErro = '';
  carregando = false;

  mostrarNovoExercicio = false;
  novoExercicio: exercicios = {
    nome: '',
    codigo: '',
    grupoMuscular: '',
    descricao: '',
  };

  treino: Treino = {
    nome: '',
    UsuarioId: '',
    tipoTreino: '',
    dataInicio: '',
    dataFim: '',
    exercicios: [],
  };

  item: ItemTreino = {
    exercicioID: '',
    series: 3,
    repeticoes: 10,
    carga: 0,
    descanso: 60,
  };

  private readonly treinoService = inject(TreinoService);
  private readonly exercicioService = inject(ExercicioService);

  async ngOnInit(): Promise<void> {
    await this.carregarExercicios();
    await this.carregarTreinos();
  }

  async carregarExercicios(): Promise<void> {
    try {
      this.exercicios = await this.exercicioService.listar();
    } catch {
      this.exibirErro('Não foi possível carregar os exercícios. Verifique se o backend está rodando.');
    }
  }

  async carregarTreinos(): Promise<void> {
    try {
      this.treinosCadastrados = await this.treinoService.listarPorUsuario(this.usuarioAtual);
    } catch {
      this.exibirErro('Não foi possível carregar os treinos. Verifique se o backend está rodando.');
    }
  }

  selecionarTreino(treino: Treino): void {
    this.treinoSelecionado = this.treinoSelecionado?.id === treino.id ? null : treino;
  }

  async cadastrarExercicio(): Promise<void> {
    if (
      !this.novoExercicio.nome.trim() ||
      !this.novoExercicio.codigo.trim() ||
      !this.novoExercicio.grupoMuscular.trim()
    ) {
      return;
    }

    try {
      const exercicioCriado = await this.exercicioService.cadastrar({ ...this.novoExercicio });

      this.novoExercicio = { nome: '', codigo: '', grupoMuscular: '', descricao: '' };
      this.mostrarNovoExercicio = false;
      await this.carregarExercicios();
      this.item.exercicioID = exercicioCriado.id ?? '';
    } catch {
      this.exibirErro('Não foi possível cadastrar o exercício.');
    }
  }

  adicionarExercicio(): void {
    if (!this.item.exercicioID) {
      return;
    }

    this.treino.exercicios.push({ ...this.item });

    this.resetarItem();
  }

  remover(indice: number): void {
    this.treino.exercicios = this.treino.exercicios.filter((_, index) => index !== indice);
  }

  async salvar(): Promise<void> {
    this.erroNome = false;
    this.erroTipoTreino = false;
    this.erroVigencia = false;
    this.erroExercicios = false;
    this.mensagemErro = '';
    this.sucesso = false;

    if (!this.treino.nome.trim()) {
      this.erroNome = true;
      return;
    }

    if (!this.treino.tipoTreino) {
      this.erroTipoTreino = true;
      return;
    }

    if (!this.treino.dataInicio || !this.treino.dataFim || this.treino.dataFim < this.treino.dataInicio) {
      this.erroVigencia = true;
      return;
    }

    if (this.treino.exercicios.length === 0) {
      this.erroExercicios = true;
      return;
    }

    this.treino.UsuarioId = this.usuarioAtual;
    this.carregando = true;

    try {
      await this.treinoService.cadastrar({ ...this.treino });
      await this.carregarTreinos();
      this.sucesso = true;
      this.limparFormulario();
    } catch (erro: any) {
      this.exibirErro(erro?.error?.message ?? 'Não foi possível salvar o treino.');
    } finally {
      this.carregando = false;
    }
  }

  limparFormulario(): void {
    this.treino = {
      nome: '',
      UsuarioId: '',
      tipoTreino: '',
      dataInicio: '',
      dataFim: '',
      exercicios: [],
    };

    this.resetarItem();
  }

  buscarNomeExercicio(id: string): string {
    const exercicio = this.exercicios.find((e) => e.id === id);

    return exercicio?.nome ?? id;
  }

  private exibirErro(mensagem: string): void {
    this.mensagemErro = mensagem;
  }

  private resetarItem(): void {
    this.item = {
      exercicioID: '',
      series: 3,
      repeticoes: 10,
      carga: 0,
      descanso: 60,
    };
  }
}
