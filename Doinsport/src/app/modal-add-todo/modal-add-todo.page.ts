import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-modal-add-todo',
  templateUrl: './modal-add-todo.page.html',
  styleUrls: ['./modal-add-todo.page.css'],
})
export class ModalAddTodoPage implements OnInit {

  constructor(private apiService: AuthentificationService) { }
  todo:string;
  ngOnInit() {
  }
  async postTodo(){
    let body={label:this.todo}
    this.apiService.postTodo(body).subscribe((res:any)=>
    console.log(res)
    )
    this.todo='';
    
  }
}
