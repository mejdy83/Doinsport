import { Component } from '@angular/core';
import { LanguageService } from './language.service';

import { NavController, LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Connexion', url: '/login', icon: 'mail' },
    { title: 'Todo', url: '/folder/Outbox', icon: 'paper-plane' }
  
  ];
  constructor(public languageService:LanguageService,public navCtrl:NavController) {this.languageService.setInitialAppLanguage();
    this.navCtrl.navigateForward('/login');}
}
