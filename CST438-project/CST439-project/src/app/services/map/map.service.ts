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
  isFiltering = false;
  filter;
  filteredEvents;
  
  constructor(private userService: UserService) {
  	this.eventMarkers = new Array();
  	this.database = firebase.database()
  	
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
  	ref.on('value', (snap) => {
  		var data = snap.val();
  		
  		var date = new Date();
  		
  		for( var key in data) {
  			var location = data[key];
  			
  			//only add locations where the current date is newer than the event date
  			var eventDate = new Date(location.date);
  			
  			
  			
  			
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
  			
  			//event already over so dont add it
  			if (eventDate < date) {
  				continue;
  			}
  			//event not started so add
  			else {
  				results.push(data[key]);
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
  			console.log('found marker');
  			console.log(this.eventMarkers[i]);
  			var loc = {
  				id: this.eventMarkers[i].id,
  				name: this.eventMarkers[i].name,
  				activity: this.eventMarkers[i].activity,
  				address: this.eventMarkers[i].address,
  				coords: {
  					lat: this.eventMarkers[i].coords.lat,
  					lng: this.eventMarkers[i].coords.lng
  				},
  				date: this.eventMarkers[i].date,
  				players: [],
  				isOpen: this.eventMarkers[i].isOpen,
  				icon: this.eventMarkers[i].icon
  			};
  			for (var j = 0; j < this.eventMarkers[i].players.length;j++) {
  			   console.log('in players');
  				var player = {
  					uid: this.eventMarkers[i].players[j].uid,
  					displayName: this.eventMarkers[i].players[j].displayName,
  					email: this.eventMarkers[i].players[j].email
  				};
  				loc.players.push(player);
  			}
  			return loc;
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

 

}