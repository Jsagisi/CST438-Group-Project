import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {



  title: string = 'My first AGM project';
  lat: number = 36.6516;
  lng: number = -121.7978;
  mapType: string = 'roadmap'
  map: {};
  

  constructor() {
  
  	//building map objec to pass into map selector in html 
  	this.map = {
  		center: {
  			lat: this.lat,
  			lng: this.lng
  		},
  		zoom: 10,
  		mapTypeId: this.mapType,
  		styles: [
  			
			{
				"featureType": "landscape",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.attraction",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.business",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.government",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.medical",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.park",
				"stylers": [{"visibility":"on"}]
			},
			{
				"featureType": "poi.place_of_worship",
				"stylers": [{"visibility":"off"}]
			},
			{
				"featureType": "poi.school",
				"stylers": [{"visibility":"on"}]
			},
			{
				"featureType": "poi.sports_complex",
				"stylers": [{"visibility":"on"}]
			},
			{
				"featureType": "transit",
				"stylers": [{"visibility":"off"}]
			}
  		]
  	};
  }

  ngOnInit() {
  }
  
  click($event) {
  	console.log($event.coords.lat + ' ' + $event.coords.lng);
  }

}
