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
    this.chatService.sendMessage(this.newMessage);
    
    //scroll chat down
    if (this.chatShouldScroll) {
    	this.scrollToBottom();
    }
    
    //reset message input
    this.newMessage = "";
    
  }

}
