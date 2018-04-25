import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages;
  newMessage: "";

  constructor(private chatService: ChatService) {

    this.messages = new Array();

  }

  ngOnInit() {

  this.chatService.onMessage().subscribe(msg => {

    this.messages.push(msg);
  })

  }

  submitMessage() {

    this.chatService.sendMessage(this.newMessage);
  }

}
