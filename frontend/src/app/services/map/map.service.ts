import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';
import * as firebase from 'firebase';
import { of } from 'rxjs/observable/of';

@Injectable()
export class MapService {

  private clickEvent = new Subject<any>();
  private searchMarkerChangedEvent = new Subject<any>();
  database;

  eventMarkers;

  constructor(private userService: UserService) {
  	this.eventMarkers = new Array();
  	this.database = firebase.database()



  }

  ngOnInit() {

  }


  addLocation(obj) {
  	this.eventMarkers.push(obj);
  };


  addUserToEvent(eventId) : boolean{
  	//get originall players array
  	var players = new Array();
  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == eventId) {
  			players = this.eventMarkers[i].players;
  			console.log('found players:'+players);
  		}
  	}

  	//get user
  	var currUser = this.userService.getUser();
  	for (var i = 0; i < players.length; i++) {
  		if (currUser.uid == players[i].uid) {
  			console.log('user not added');
  			return false;
  		}
  	}

  	players.push(currUser);
  	console.log('user added');

  	//update database
  	this.database.ref('/locations/' + eventId)
  	.update({players: players});

  	return true;
  }


  getLocations(cb) {

  	var results = new Array();
  	var ref =this.database.ref('/locations');
  	ref.on('value', (snap) => {
  		var data = snap.val();

  		for( var key in data) {
  			results.push(data[key]);

  		}
  		this.eventMarkers = results;
  		cb(results);
  	});
  }


  emitClickEvent(type: any) {
    console.log('emit ' + type);
  	this.clickEvent.next({text: type});
  }

  getClickEvent(): Observable<any> {
    console.log('get');
  	return this.clickEvent.asObservable();
  }


  searchMarkerChanged(newMarker) {
  	this.searchMarkerChangedEvent.next({marker: newMarker});
  }

  getSearchMarkerEvent() : Observable<any> {
  	return this.searchMarkerChangedEvent.asObservable();
  }



}
