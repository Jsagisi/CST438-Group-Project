import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class UserService {

  user : {
  		displayName: string,
  		email: string,
  		phoneNumber: string,
   		photoURL: string,
  		uid: string
  };
  config = {
    apiKey: "AIzaSyD6QcSARwORPKz_E8ys-yyWtCkyeZCYdsA",
    authDomain: "cst438-project-80304.firebaseapp.com",
    databaseURL: "https://cst438-project-80304.firebaseio.com",
    projectId: "cst438-project-80304",
    storageBucket: "",
    messagingSenderId: "351856084400"
   };
   app;
   
   
  constructor() {
  	//initialize firebase reference
  	this.app = firebase.initializeApp(this.config);
  	
  	this.user = {

  		displayName: " ",
  		email: " ",
  		phoneNumber: " ",
  		photoURL: " ",
  		uid: " "
  	};
  	
  }
  
  public getUser() {
  	return this.user;
  }
  
  public setUser(user) {
  	this.user = user;
  }
  
  
  public isLoggedIn() : boolean {
  	var user = firebase.auth().currentUser;
  	
  	if (user) {
  		return true;
  	}
  	else {
  		return false;
  	}
  }
  
  signInUser(email, password, callback) {
  	firebase.auth().signInWithEmailAndPassword(email, password)
  	.then((user) => {
  		
  		this.user = {
  			displayName: user.displayName,
  			email: user.email,
  			phoneNumber: user.phoneNumber,
  			photoURL: user.photoURL,
  			uid: user.uid
  		};
  		return callback(null,this.user);
  	})
  	.catch((error) => {
  		return callback(error,null);
  
	});
  }
  
  


}
