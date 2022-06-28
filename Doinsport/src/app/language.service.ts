import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selected = '';
  constructor(
    private translate: TranslateService,
    private plt: Platform
  ) { }

  setInitialAppLanguage(){
    this.setLanguage('fr');
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    
  }

  getLanguage (){
    return [
      { text: 'Français', value: 'fr', img: 'assets/imgs/fr.png' },
      { text: 'English', value: 'en', img: 'assets/imgs/en.png' }
    ];
  }

  setLanguage(lng){
    this.translate.use(lng);
    this.selected = lng;
  }
}
