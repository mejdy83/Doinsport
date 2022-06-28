import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { AuthentificationService } from '../authentification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs/internal/observable/from';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  language: string = this.translateService.currentLang;
  validations_form: FormGroup;
  remember: boolean = false;
  errorMessage: string = 'statusOK';
  tokenDevice: string = '';
  emailUser: string = '';
  password: string = '';
  restAPI: string = environment.URL_API;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  constructor(public translateService: TranslateService, private storage: Storage, private apiService: AuthentificationService, private navCtrl: NavController,
    private authService: AuthentificationService,
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController) { }
  validation_messages = {
    'email': [
      { type: 'required', message: 'emailRequired' },
      { type: 'pattern', message: 'emailPattern' }
    ],
    'password': [
      { type: 'required', message: 'passwordRequired' },
      { type: 'minlength', message: 'passwordminlength' }
    ],
    'BDSelected': [
      { type: 'required', message: 'databaseRequired' },
    ]
  };

  async ngOnInit() {
    
    
    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^[a-z0-9!#$%&*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$')
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
   
      await this.storage.get('username').then((res)=>this.emailUser=res);
      await this.storage.get('password').then((res)=>this.password=res);
      
    this.validations_form.setValue({username:this.emailUser,password:this.password});
  }
  async login() {
    if (this.remember) {
      this.apiService.remember(this.validations_form.value.username, this.validations_form.value.password);
    }
    console.log('ici')
    //let body = JSON.stringify({ username: this.emailUser, password: this.password })
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.validations_form.value).subscribe(
      async _ => {
        await loading.dismiss();

        this.router.navigateByUrl('/todo', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );

  }
  async verifOk() {
    let a: any = {};
    this.translateService.get('forgotPWD.verifOKHeader').subscribe(t => {
      a.header = t;
    });
    this.translateService.get('forgotPWD.verifOKsubHeader').subscribe(t => {
      a.subheader = t;
    });
    const alert = await this.alertController.create({
      header: a.header,
      subHeader: a.subheader,
      buttons: ['OK']
    });
    alert.present();
  }

  async verifNotOk() {
    let a: any = {};
    this.translateService.get('forgotPWD.verifNotOKHeader').subscribe(t => {
      a.header = t;
    });
    this.translateService.get('forgotPWD.verifNotOKsubHeader').subscribe(t => {
      a.subheader = t;
    });
    const alert = await this.alertController.create({
      header: a.header,
      subHeader: a.subheader,
      buttons: ['OK']
    });
    alert.present();
  }
  async presentLoading() {
    let a: any = {};
    this.translateService.get('presentLoading.alertMSG').subscribe(t => {
      a.message = t;
    });
    const loading = await this.loadingController.create({
      cssClass: 'my-loading-class',
      message: a.message,
      duration: 5000
    });
    await loading.present();
    console.log('Loading dismissed!');
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
