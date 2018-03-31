import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MapService } from '../../../services/map/map.service';
import { Subscription } from 'rxjs/Subscription';
import * as angular from '@angular/core';
import { UserService } from '../../../services/user-service/user.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  @Output() addLocation = new EventEmitter<boolean>();
  
  markerSubscription: Subscription;
  clickSubscription : Subscription;
  
  locationName: string;
  locationAddress:string;
  locationCoords: {lat: number, lng: number};
  date: string;
  activity: string;
  
  

  constructor(private mapService: MapService, private userService: UserService) { 
  
  
  	this.date = "";
  	this.locationName = "";
  	this.locationAddress = "";
  	this.activity = "";
  	this.locationCoords = {
  		lat: 0.0,
  		lng: 0.0
  	};
  	
  	
  	this.mapService.searchMarkerChanged( {
  		isOpen: true,
  		text: "Drag Me"
  	});
  	
  	
  }

  ngOnInit() {
  	this.clickSubscription = this.mapService.getClickEvent().subscribe(data => {
  		console.log(data);
  		this.locationName = data.text.name;
  		this.locationAddress = data.text.address;
  		this.locationCoords.lat = data.text.coords.lat;
  		this.locationCoords.lng = data.text.coords.lng;
  	});
  }
  
  ngOnDestroy() {
  	this.mapService.searchMarkerChanged({
  		isOpen: false,
  		text: "Drag Me"
  	});
  }
  
  
  
  /*
  Checks if form to add new lcoation is missing any fields
  */
  formIsValid() : boolean {
 	
 	var name = document.getElementById('name')["value"];
 	var addr = document.getElementById('address')["value"];
 	var activity = this.activity;
 	var date = this.date;
 	
 	
 	
 	return (
 		name != null && 
 		name.length > 0 &&
 		addr != null &&
 		addr.length > 0 &&
 		activity.length > 0 &&
 		date.length > 0
 	);
  
  	
  }
  
  addEvent() {
  	
  	//save variables for when form refreshes
  	var name = this.locationName;
  	var addr = this.locationAddress;
  	var activity = this.activity;
  	var date = this.date;
  	
  	
  	
  	if (this.formIsValid() == true) {
  		
  		//add event to database
  		var user = this.userService.getUser();
  		var lat = document.getElementById('lat')["value"];
  		var lng = document.getElementById('lng')["value"];
  		console.log(this.locationCoords);
  		//make new locations object ot insert
  		var newLocation = {
  			name: document.getElementById('name')["value"],
  			address: document.getElementById('address')["value"],
  			activity: this.activity,
  			date: this.date,
  			coords : {
  				lat: lat,
  				lng: lng
  			},
  			players : [
  				user
  			]
  		};
  		this.userService.insertLocation(newLocation);
  		this.mapService.addLocation(newLocation);
  		
  		
  		
  	}
  	else {
  		
  		
  	}
  	
  	//restore the text in the form
  	this.locationName = name;
  	this.locationAddress = addr;
  	this.activity = activity;
  	this.date = date;
  }
  
  handleClickEvent(message) {
  	console.log(message);
  }

}
