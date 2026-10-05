import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';

import { CadastroService } from 'src/app/cadastro-service';
import { Usuario } from '../modelo/usuario.modelo';

@Component({
  selector: 'app-cadastro-alteracao',
  templateUrl: './alteracao-cadastro.page.html',
  styleUrls: ['./alteracao-cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonMenuButton,
  ],
})
export class CadastroAlteracaoPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cadastroService = inject(CadastroService);
  private formBuilder = inject(NonNullableFormBuilder);

  protected usuario!: Usuario;

  protected form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    numero: [
      '',
      [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
    ],
    email: ['', [Validators.required]],
    cpf: [
      '',
      [Validators.required, Validators.minLength(11), Validators.maxLength(11)],
    ],
  });

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');

    if (cpf) {
      this.usuario = this.cadastroService.obterPeloCpf(cpf);

      this.form.setValue({
        nome: this.usuario.nome,
        numero: this.usuario.numero,
        email: this.usuario.email,
        cpf: this.usuario.cpf,
      });
    }
  }

  protected alterar(): void {
    if (this.form.valid) {
      const usuario: Usuario = this.form.getRawValue();

      this.cadastroService.alterar(usuario);

      this.router.navigate(['/cadastro']);
    }
  }
}
