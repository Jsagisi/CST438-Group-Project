import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {of} from 'rxjs/observable/of';
import {User, UserModel} from "../../models/User";


@Injectable()
export class UserService {

  user: User;
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

    this.user =UserModel.nullUser()

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

    //this is a strange dependency...

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
        this.user = UserModel.fromFirebaseUser(user);
      }
      else {

      }
    });
  }


  public isLoggedIn(): boolean {
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

        this.user = UserModel.fromFirebaseUser(user);
        return callback(null, this.user);
      })
      .catch((error) => {
        return callback(error, null);

      });
  }


  registerUser(email, password, username, callback) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        var currUser = firebase.auth().currentUser;

        if (currUser != null) {

          this.user = UserModel.fromFirebaseUser(user);

          currUser.updateProfile({
            displayName: username,
            photoURL: ""
          }).then(() => {
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
        callback(error, null);

      });
  }


  logoutUser(callback) {
    firebase.auth().signOut()
      .then(() => {
        this.user = UserModel.nullUser()
        callback(null, true);
      })
      .catch((error) => {
        callback(error, null);
      });
  }


}
