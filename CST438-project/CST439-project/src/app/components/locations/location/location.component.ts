import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MapService } from '../../../services/map/map.service';
import { Subscription } from 'rxjs/Subscription';


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
  locationAddress:string
  locationCoords: {lat: number, lng: number};

  constructor(private mapService: MapService) { 
  
  	this.locationName = "";
  	this.locationAddress = "";
  	this.locationCoords = {
  		lat: 0.0,
  		lng: 0.0
  	};
  	this.clickSubscription = this.mapService.getClickEvent().subscribe(data => {
  		console.log(data);
  		this.locationName = data.text.name;
  		this.locationAddress = data.text.address;
  		this.locationCoords = data.text.coords;
  	});
  	
  	this.mapService.searchMarkerChanged( {
  		isOpen: true,
  		text: "Drag Me"
  	});
  }

  ngOnInit() {
  
  }
  
  ngOnDestroy() {
  	this.mapService.searchMarkerChanged({
  		isOpen: false,
  		text: "Drag Me"
  	});
  }
  
  add() {
  	this.mapService.emitClickEvent('addLocation');
  }
  
  handleClickEvent(message) {
  	console.log(message);
  }

}
