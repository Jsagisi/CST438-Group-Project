import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';
import * as firebase from 'firebase';
import { of } from 'rxjs/observable/of';

declare var require: any

@Injectable()
export class MapService {

  private clickEvent = new Subject<any>();
  private searchMarkerChangedEvent = new Subject<any>();
  database;
  storage;

  eventMarkers;
  isFiltering = false;
  filter;
  filteredEvents;

  constructor(private userService: UserService) {
  	this.eventMarkers = new Array();
  	this.database = firebase.database()
  	this.storage = firebase.storage();

  	this.isFiltering = false;
  	this.filteredEvents = new Array();

  }

  ngOnInit() {
  	this.downloadLocations((data) => {
  		this.eventMarkers = data;
  	});
  }


  addLocation(obj) {
  	obj.isOpen = false;
  	this.eventMarkers.push(obj);

  };


  addUserToEvent(eventId) : boolean{
  	//get originall players array
  	var players = new Array();
  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == eventId) {
  			players = this.eventMarkers[i].players;

  		}
  	}

  	//get user
  	var currUser = this.userService.getUser();
  	for (var i = 0; i < players.length; i++) {
  		if (currUser.uid == players[i].uid) {

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


  downloadLocations(cb) {

  	var results = new Array();
  	var ref =this.database.ref('/locations');
  	var self = this;
  	ref.on('value', (snap) => {
  		var data = snap.val();

  		var date = new Date();

  		for( var key in data) {
  			var location = data[key];

  			console.log("Raw Date:"+location.date)

  			//only add locations where the current date is newer than the event date
  			var eventDate = new Date(location.date);
  			console.log("Parse Date:"+eventDate)



  			//get icon for event marker
  			switch (location.activity) {
  				case 'basketball':
  					data[key].icon = require('../../../images/basketball.png');
  					break;
  				case 'baseball':
  					data[key].icon = require('../../../images/baseball.png');
  					break;
  				case 'football':
  					data[key].icon = require('../../../images/football.png');
  					break;
  				default:
  					data[key].icon = require('../../../images/soccerball.png');


  			}
  			
  			

  			data[key].isOpen = false;

  			if (eventDate < date || (location.finished) || location.teams) {
  				results.push(location);
  			}
  			
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


  getLocations() {

  	if (this.isFiltering == true) {
  		return this.filteredEvents;
  	}
  	else {
  		return this.eventMarkers;
  	}
  }


  filterLocations(type) {

  	this.filter = type;

  	if (type == 'all') {
  		this.isFiltering = false;
  	}
  	else {
  	this.isFiltering = true;
  		this.filteredEvents = new Array();

  		for (var i = 0; i < this.eventMarkers.length;i++) {
  			if (this.eventMarkers[i].activity == type) {
  				this.filteredEvents.push(this.eventMarkers[i]);
  			}
  		}
  	}

  }


  getMarkerById(id) {

  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == id) {
  			return this.eventMarkers[i];
  		}
  	}

  }


  updateMarkerById(newMarker) {
  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == newMarker.id) {
  			this.eventMarkers[i] = newMarker;
  		}
  	}
  }


  setMarkerOpen(id, open) {
  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == id) {
  			this.eventMarkers[i].isOpen = open;
  		}
  	}
  }
  
  
  getMatchById(id) {
  	for (var i = 0; i < this.eventMarkers.length;i++) {
  		if (this.eventMarkers[i].id == id) {
  			return this.eventMarkers[i];
  		}
  	}
  	
  	return null;		
  }



}
