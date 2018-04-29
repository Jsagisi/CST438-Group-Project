import {Component, OnInit, ElementRef, NgZone, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import {MapsAPILoader} from '@agm/core';
import {Router} from '@angular/router';
import {MapService} from '../../services/map/map.service';
import {Subscription} from 'rxjs/Subscription';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {UserService} from '../../services/user-service/user.service';

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
  map: any = {};
  searchControl: FormControl;
  markers;
  homeCoords: { lat: number, lng: number };
  placeService;
  searchMarker: {
    lat: number,
    lng: number,
    isOpen: boolean,
    text: string
  };
  currentSearchLocation: {
    lat: number,
    lng: number
  };
  poiList;
  dataLoaded: boolean;
  filter: string;
  showFilter;


  clickSubscription: Subscription;
  markerSubscription: Subscription;

  @ViewChild("search")
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public router: Router,
    public mapService: MapService,
    public userService: UserService) {

    this.filter = 'all';
    this.showFilter = true;

    this.placeService = null;

    this.dataLoaded = false;

    this.poiList = new Array();

    this.homeCoords = {
      lat: 36.63536611993544,
      lng: -121.81724309921265
    };

    this.searchMarker = {
      lat: this.homeCoords.lat - 0.05,
      lng: this.homeCoords.lng + 0.04,
      isOpen: false,
      text: "Drag Me"
    };

    this.currentSearchLocation = {
      lat: 0.0,
      lng: 0.0
    };

    this.markers = new Array();


    this.zoom = 10;
    this.lat = 36.63536611993544;
    this.lng = -121.81724309921265;


    //building map objec to pass into map selector in html
    this.map = {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: this.zoom,
      mapTypeId: this.mapType,
      styles: [

        {
          "featureType": "landscape",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.attraction",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.business",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.government",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.medical",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.park",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "poi.place_of_worship",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.school",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "poi.sports_complex",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "transit",
          "stylers": [{"visibility": "off"}]
        }
      ]
    };


    this.markerSubscription = this.mapService.getSearchMarkerEvent().subscribe(res => {

      this.searchMarker.isOpen = res.marker.isOpen;

      if (res.marker.isOpen == true) {
        this.searchMarker.lat = this.lat;
        this.searchMarker.lng = this.lng;
      }
    });


  }

  ngOnInit() {

    this.mapService.downloadLocations((data) => {
      this.markers = data;

      for (var i = 0; i < this.markers.length; i++) {
        //console.log(this.markers[i]);
        var latStr = this.markers[i].coords.lat;
        var latNum = parseFloat(latStr);
        var lngStr = this.markers[i].coords.lng;
        var lngNum = parseFloat(lngStr);
        this.markers[i].coords = {
          lat: latNum,
          lng: lngNum
        };
      }
      this.dataLoaded = true;
    });


    this.searchControl = new FormControl();


    this.setCurrentPosition();

    //filters search results of location search bar and moves
    //map to the selected area when clicked
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
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

          this.searchMarker.lat = this.lat;
          this.searchMarker.lng = this.lng;
          this.searchMarker.text = place.name;

          this.currentSearchLocation.lat = place.geometry.location.lat();
          this.currentSearchLocation.lng = place.geometry.location.lng();


          this.getLocationInfo(place.geometry.location.lat(), place.geometry.location.lng(), (error, data) => {

            this.searchMarker.text = place.name;
          });
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

        this.homeCoords.lat = position.coords.latitude;
        this.homeCoords.lng = position.coords.longitude;

        this.userService.setUserCoords(this.homeCoords);

      });
    }
  }


  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadiusKm * c;
    return earthRadiusKm * d;
  }


  mapReady($event) {
    this.placeService = new google.maps.places.PlacesService($event);
    this.getPoiList((error, list) => {

    });
  }


  getPoiList(callback) {
    var request = {
      location: this.homeCoords,
      radius: '100000',
      type: ['park']
    };
    var list = new Array();

    this.placeService.nearbySearch(request, (results1, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results1.length; i++) {
          this.poiList.push(results1[i]);
        }
        request.type = ['gym'];
        this.placeService.nearbySearch(request, (results2, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results2.length; i++) {
              this.poiList.push(results2[i]);
            }
            request.type = ['school'];
            this.placeService.nearbySearch(request, (results3, status) => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results3.length; i++) {
                  this.poiList.push(results3[i]);
                }
                request.type = ['stadium'];
                this.placeService.nearbySearch(request, (results4, status) => {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results4.length; i++) {
                      this.poiList.push(results4[i]);

                    }
                    request.type = ['store'];
                    this.placeService.nearbySearch(request, (results5, status) => {
                      if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results5.length; i++) {
                          this.poiList.push(results5[i]);

                        }
                        callback(null, list);

                      }
                    });

                  }
                });

              }
            });
          }
        });
      }
    });
  }


  getLocationInfo(lat, lng, callback) {


    var data = {
      coords: {
        lat: lat,
        lng: lng
      },
      name: "",
      address: "",
      isOpen: true
    };

    var latlng = {lat: lat, lng: lng};
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {

          var placeId = results[0].place_id;
          this.placeService.getDetails({placeId: placeId}, (result, status) => {
            console.log(result);
          });

          var matched = false;
          for (var i = 0; i < this.poiList.length; i++) {


            if (this.distanceInKmBetweenEarthCoordinates(lng, lat, this.poiList[i].geometry.location.lng(), this.poiList[i].geometry.location.lat()) <= 202) {
              data.name = this.poiList[i].name;
              matched = true;
              break;
            }
          }

          data.address = results[0].formatted_address;
          var placeId = results[0].place_id;


          if (this.distanceInKmBetweenEarthCoordinates(lng, lat, this.currentSearchLocation.lng, this.currentSearchLocation.lat) <= 202) {
            data.name = this.searchElementRef.nativeElement.value.split(',')[0];
          }
          else if (matched) {

          }
          else {
            data.name = results[0].address_components[1].long_name;
          }


          this.mapService.emitClickEvent(data);
          callback(null, data);
        }

      }
      callback('error', null);

    });

  }


  click($event) {

    this.searchMarker.lat = $event.coords.lat;
    this.searchMarker.lng = $event.coords.lng;

    this.getLocationInfo($event.coords.lat, $event.coords.lng, (error, data) => {
      if (error != null) {

      }
      else {
        this.searchMarker.text = data.name;
      }
    });

  }


  searchWasDragged($event) {
    this.getLocationInfo($event.coords.lat, $event.coords.lng, (error, data) => {
      if (error != null) {

      }
      else {
        this.searchMarker.text = data.name;
      }
    });
  }

  centerChanged($event) {
    this.lat = $event.lat;
    this.lng = $event.lng;
  }

  navigate(path: string): void {

    //reset activity filter
    this.filter = 'all';
    this.mapService.filterLocations(this.filter);

    if (path == 'map') {

      this.showFilters();
    }
    else {
      this.hideFilters();
    }

    this.router.navigateByUrl('/' + path);
  }

  addLocation() {
    console.log('clicked');
  }


  hideFilters() {
    this.showFilter = false;
  }

  showFilters() {
    this.showFilter = true;
  }


  filterLocations() {
    this.mapService.filterLocations(this.filter);
  }

  markerClicked(id) {
    var clickedMarker = this.mapService.getMarkerById(id);

    var newOpen = !clickedMarker.isOpen;
    this.mapService.setMarkerOpen(id, newOpen);

    //navigate to location details component
    this.router.navigate(['map/locations', id]);
  }

}
