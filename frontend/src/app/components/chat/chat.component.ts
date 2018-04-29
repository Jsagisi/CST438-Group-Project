import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import * as moment from 'moment'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: any[];
  newMessage: FormControl;

  constructor(private chatService: ChatService) {
    this.messages = [];

    this.newMessage = new FormControl();


  }


  ngOnInit() {

    this.chatService.onMessage().subscribe(msg => {
      this.messages.push(msg);
    });
    if (!environment.production) {
      for (let i = 0; i < 5; i++) {
        this.messages.push(
          {
            time: moment.utc().toISOString(),
            username: "Dummy",
            message: `Wow what a message ${i}`
          });
      }
    }

  }


  //scrolls chat to bottom of div
  scrollToBottom() {
    var chatDiv = document.getElementById('chat');
    chatDiv.scrollTop = chatDiv.scrollHeight + 20;
  }


  //decides if enough messages are in char to need to scroll
  chatShouldScroll() {
    var chatDiv = document.getElementById('chat');
    return chatDiv.scrollTop + chatDiv.clientHeight === chatDiv.scrollHeight;
  }

  submitMessage() {

    //send message to server
    this.chatService.sendMessage(this.newMessage.value);

    //scroll chat down
    if (this.chatShouldScroll) {
      this.scrollToBottom();
    }

    //reset message input
    this.newMessage.setValue('');

  }

}
