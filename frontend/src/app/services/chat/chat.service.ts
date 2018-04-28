import { Injectable } from '@angular/core';
import  * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user-service/user.service';

@Injectable()
export class ChatService {


  socket;

  constructor(private userService: UserService) {
    console.log('in constructor');
    this.socket = io('http://localhost:3000');



  }


  sendMessage(message) {
    var msg = {
      message: message,
      username: this.userService.getUser().displayName
    };
    this.socket.emit('message', msg);
  }


  onMessage() {
    return Observable.create(observer => {
      this.socket.on('serverMessage', msg => {

        observer.next(msg);
      })
    })
  }

}
