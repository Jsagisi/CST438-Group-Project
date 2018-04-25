import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  constructor(private userService: UserService,
              private chatService: ChatService) {



  }

  /*changes*/
  ngOnInit() {
  	this.userService.downloadUser();
  }

}
