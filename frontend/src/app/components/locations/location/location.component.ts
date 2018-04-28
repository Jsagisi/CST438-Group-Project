import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {MapService} from '../../../services/map/map.service';
import {Subscription} from 'rxjs/Subscription';
import * as angular from '@angular/core';
import { UserService } from '../../../services/user-service/user.service';
import * as firebase from 'firebase';
import {Form, FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  @Output() addLocation = new EventEmitter<boolean>();

  //emitter than sends a subscribable event when a new locatino
  //object is formed. Other components can subscribe to it and
  //get the location that was made in ths component
  @Output() onLocation: EventEmitter<any> = new EventEmitter<any>();

  locationNameElem: FormControl;
  activityElem: FormControl;
  startDateElem: FormControl;
  markerSubscription: Subscription;
  clickSubscription: Subscription;

  locationName: string;
  locationAddress: string;
  locationCoords: { lat: number, lng: number };
  date: string;
  activity: string;


  @Input() type: string = 'location';

  constructor(private mapService: MapService, private userService: UserService) {
    this.locationNameElem = new FormControl('', [Validators.required]);
    this.activityElem = new FormControl('basketball', [Validators.required]);
    this.startDateElem = new FormControl('', [Validators.required])
    this.date = "";
    this.locationName = "";
    this.locationAddress = "";
    this.activity = "";
    this.locationCoords = {
      lat: 0.0,
      lng: 0.0
    };


    this.mapService.searchMarkerChanged({
      isOpen: true,
      text: "Drag Me"
    });


  }

  submissionError: String = null;

  getNameError() {
    return this.locationNameElem.hasError('required') ? 'You must enter a name' : '';
  }

  getDateError() {
    return this.locationNameElem.hasError('required') ? 'You must enter a date' : '';
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
  formIsValid(): boolean {

    return this.locationNameElem.valid && this.startDateElem.valid && this.locationCoords.lat != 0 && this.locationCoords.lng != 0;

  }

  debug() {
    console.log(this.startDateElem.value);
  }

  addEvent() {

    //save variables for when form refreshes
    var name = this.locationName;
    var addr = this.locationAddress;
    var activity = this.activity;
    var date = this.date;

	console.log('valid = ' + this.formIsValid());
    if (this.formIsValid() == true ) {

	  //if type is 'location' then just get data
	  //from forms and insert new location to db
      if (this.type == 'location') {
      	//add event to database
      var user = this.userService.getUser();
      var lat = this.locationCoords.lat;
      var lng = this.locationCoords.lng;
      console.log(this.locationCoords);
      //make new locations object ot insert
      var newLocation = {
          name: this.locationNameElem.value,
          address: this.locationAddress,
          activity: this.activityElem.value,
          date: (this.startDateElem.value as Date).toISOString(),
          coords:
            {
              lat: lat,
              lng: lng
            }
          ,
          players: [
            user
          ]
        }
      ;
      console.log(newLocation)
      this.userService.insertLocation(newLocation);
      this.mapService.addLocation(newLocation);
      }

      //if type is 'match' then do not submit new location
      //object. The find match component wants to intercept
      //the data in the form to use in its onw form
	  else {
	  		 var user = this.userService.getUser();
      var lat = this.locationCoords.lat;
      var lng = this.locationCoords.lng;
      console.log(this.locationCoords);
      //make new locations object ot insert
      var newLocation = {
          name: this.locationNameElem.value,
          address: this.locationAddress,
          activity: this.activityElem.value,
          date: (this.startDateElem.value as Date).toISOString(),
          coords:
            {
              lat: lat,
              lng: lng
            }
          ,
          players: [
            user
          ]
        }
      ;
      this.onLocation.emit(newLocation);
	  }

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
