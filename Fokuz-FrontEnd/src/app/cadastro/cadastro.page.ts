import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonCol,
  IonInput,
  IonSearchbar,
  IonItem,
  IonGrid,
} from '@ionic/angular/standalone';

import { ToastController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { trashOutline, saveOutline, pencilSharp } from 'ionicons/icons';
import { CadastroService } from 'src/app/cadastro-service';
import { Usuario } from '../modelo/usuario.modelo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonItem,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRow,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonCol,
    IonInput,
    IonSearchbar,
  ],
})
export class CadastroPage implements OnInit {
  public pesquisar = '';
  public cadastros: Usuario[] = [];

  private formBuilder = inject(NonNullableFormBuilder);
  private cadastroService = inject(CadastroService);
  private toast = inject(ToastController);
  private router = inject(Router);

  protected cadastroForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    numero: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^[0-9]*$/),
      ],
    ],
    email: ['', [Validators.required, Validators.minLength(6)]],
    cpf: [
      '',
      [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^[0-9]*$/),
      ],
    ],
  });

  constructor() {
    addIcons({ saveOutline, trashOutline, pencilSharp });
  }

  ngOnInit(): void {}

  salvar(): void {
    if (this.cadastroForm.invalid) {
      return;
    }

    const novoCadastro: Usuario = this.cadastroForm.getRawValue();

    const salvou = this.cadastroService.salvar(novoCadastro);

    if (!salvou) {
      alert('Usuário já cadastrado');
      return;
    }

    this.exibirMensagem('Cadastrado com sucesso');

    this.cadastros = this.cadastroService.obterTodos();

    this.cadastroForm.reset();
  }

  protected excluir(cpf: string): void {
    this.cadastroService.excluir(cpf);
    this.cadastros = this.cadastroService.obterTodos();
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  protected salvarPesquisa(): void {
    if (this.pesquisar === '') {
      this.cadastros = this.cadastroService.obterTodos();
      return;
    }

    const Numeros = /^[0-9]+$/;
    const Letras = /^[a-zA-Zá-úÁ-ÚçÇãõÃÕ ]+$/;
    const misto = /^[0-9a-zA-Zá-úÁ-ÚçÇãõÃÕ ]+$/;

    if (Letras.test(this.pesquisar)) {
      this.cadastros = this.cadastroService.buscarPeloNome(this.pesquisar);
    } else if (Numeros.test(this.pesquisar)) {
    
      this.cadastros = this.cadastroService.buscarPelaChavePrimaria(
        this.pesquisar,
      );
    } else if (misto.test(this.pesquisar)) {
      this.cadastros = this.cadastroService.buscarPelaChavePrimaria(
        this.pesquisar,
      );
    } else {
      this.cadastros = this.cadastroService.obterTodos();
    }
  }

  protected redirecionar(cpf: string) {
    this.router.navigate(['/alteracao-cadastro', cpf]);
  }

  ionViewWillEnter() {
    this.cadastros = this.cadastroService.obterTodos();
  }
}
