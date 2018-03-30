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
