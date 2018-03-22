import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {



  title: string = 'My first AGM project';
  lat: number;
  lng: number;
  zoom: number;
  mapType: string = 'roadmap';
  map: {};
  searchControl: FormControl;
  
  
  
  @ViewChild("search")
  public searchElementRef: ElementRef;
  

  constructor(
  	private mapsAPILoader: MapsAPILoader,
  	private ngZone: NgZone) {
  	
  	this.zoom = 10;
  	this.lat = 39.8282;
    this.lng = -98.5795;
  
  	//building map objec to pass into map selector in html 
  	this.map = {
  		center: {
  			lat: this.lat,
  			lng: this.lng
  		},
  		zoom: this.zoom,
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
  
  	this.searchControl = new FormControl();
  	
	this.setCurrentPosition();
  	
  	//filters search results of location search bar and moves
  	//map to the selected area when clicked
  	this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 16;
        });
      });
    });
  
  }
  
 
  /*
  Gets users location from browser and moves map to users
  location. Promps a permissions request on browser
  */
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
  		this.zoom = 10;
      });
    }
  }
  
   click($event) {
  	console.log($event.coords.lat + ' ' + $event.coords.lng);
  }

}
