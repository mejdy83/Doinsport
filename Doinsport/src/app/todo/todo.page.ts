
import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
 
import { ModalController, NavController } from '@ionic/angular';
import { ModalAddTodoPage } from '../modal-add-todo/modal-add-todo.page';
@Component({
  selector: 'app-inside',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  id = null;
  listTodos:any[];
  todo:string;
  searchFilter:string;
  lenght: number;
  constructor(private apiService: AuthentificationService,private modalCtrl: ModalController,public navCtrl:NavController) { }
 
  ngOnInit() { 
    this.getUserInfo();
    this.getTodo();
  }
  async loadData(event) {
      this.getTodo()
      event.target.complete();
      if (this.listTodos.length == this.lenght) {
        event.target.disabled = true;
      }

  }
  async getUserInfo() {
    this.id = null;
 
    this.apiService.getUserInfo().subscribe((res: any) => {
      this.id = res.id;
      console.log(this.id)
    });
  }
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddTodoPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    
    await modal.present();
    modal.onDidDismiss().then((res)=>this.getTodo())
  }
  async getTodo() {
    this.listTodos = null;
 
    this.apiService.getTodo().subscribe((res: any) => {
      this.listTodos = res.rows;
      this.lenght=res.count;
    });
    console.log(this.lenght)

  }
  logout(){
    this.navCtrl.navigateForward('/login')
  }
  async postTodo(){
    let body={label:this.todo}
    this.apiService.postTodo(body).subscribe((res:any)=>
    console.log(res)
    )
    this.todo='';
    this.getTodo();
  }
  // async checkTodo(id){
    
  //   this.apiService.putTodo(id).subscribe((res:any)=>
  //   console.log(res)
  //   )
    
  //   this.getTodo();
  // }
  updateSearchResults(){
    this.listTodos = null;
 
    this.apiService.getTodo().subscribe((res: any) => {
      this.listTodos = res.rows;
     
    });
  }
  async deleteTodo(id){
    console.log(id)
    this.apiService.deleteTodo(id).subscribe((res)=>console.log(res));
    this.getTodo();
  }
  
}