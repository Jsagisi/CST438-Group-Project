import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

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
    projectId: "gs://cst438-project-80304.appspot.com/",
    storageBucket: "gs://cst438-project-80304.appspot.com/",
    messagingSenderId: "351856084400"
   };
   app;
   database;
   userCoords;
   
   
  constructor() {
  	//initialize firebase reference
  	this.app = firebase.initializeApp(this.config);
  	this.database = firebase.database();
  	
  	this.user = {

  		displayName: " ",
  		email: " ",
  		phoneNumber: " ",
  		photoURL: " ",
  		uid: " "
  	};
  	
  	this.downloadUser();
  	
  	this.userCoords = {
  		lat: 0,
  		lng: 0
  	};
  	
  	
  }
  
  
  insertLocation(data) {
  	var newLocationRef = this.database.ref('/locations').push();
  	var id = newLocationRef.key;
  	data.id = id;
  	newLocationRef.set(data);
  };
  
  
 
  setUserCoords(coords) {
  	this.userCoords = coords;
  }
  
  
  getUser() {
  
  	if (firebase.auth().currentUser != null) {
  		return this.user;
  	}
  }
  
  public setUser(user) {
  	this.user = user;
  }
  
  
  downloadUser() {
  	firebase.auth().onAuthStateChanged((user) => {
  		if (user != null) {
  			this.user = {
  				displayName: user.displayName,
  				email: user.email,
  				phoneNumber: user.phoneNumber,
  				photoURL: user.photoURL,
  				uid: user.uid
  			};
  		}
  		else {
  			
  		}
  	});
  }
  
  
  public isLoggedIn() : boolean {
  	var user = firebase.auth().currentUser;
  	
  	if (user != null) {
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
  
  
  registerUser(email, password, username, callback) {
  	
  	firebase.auth().createUserWithEmailAndPassword(email, password)
  	.then((user) => {
  		var currUser = firebase.auth().currentUser;
  		
  		if (currUser != null) {
  		    
			this.user = {
  				displayName: user.displayName,
  				email: user.email,
  				phoneNumber: user.phoneNumber,
  				photoURL: user.photoURL,
  				uid: user.uid
  			};  		
  		
  			currUser.updateProfile({
  				displayName: username,
  				photoURL: ""
  			}).then( () => {
  			    console.log('updated user profile');
  				callback(null, this.user); 
  			
  			}).catch((error) => {
  			    console.log('error updating profile');
  				callback(error, null);
  			});
  		}
  	})
  	.catch((error) => {
  	    console.log('error registering user');
  		callback(error,null);
 
	});
  }
  
  
  logoutUser(callback) {
 	firebase.auth().signOut()
 	.then( () => {
 		this.user = {

  		displayName: " ",
  		email: " ",
  		phoneNumber: " ",
  		photoURL: " ",
  		uid: " "
  	};
 		callback(null, true); 
 	})
 	.catch((error) => {
 		callback(error, null);
 	});
  } 
  
  


}
