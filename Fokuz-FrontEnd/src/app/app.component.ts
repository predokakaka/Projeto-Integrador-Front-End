import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  fitnessOutline,
  homeOutline,
  personAddOutline,
  personOutline,
} from 'ionicons/icons';

interface PaginaMenu {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  // Páginas disponíveis para navegação pelo menu lateral.
  paginas: PaginaMenu[] = [
    { title: 'Início', url: '/home', icon: 'home-outline' },
    { title: 'Cadastro de Usuário', url: '/cadastro', icon: 'person-add-outline' },
    { title: 'Perfil', url: '/perfil', icon: 'person-outline' },
    { title: 'Planos de Treino', url: '/cadastro-treino', icon: 'fitness-outline' },
  ];

  constructor() {
    addIcons({ homeOutline, personAddOutline, personOutline, fitnessOutline });
  }
}
