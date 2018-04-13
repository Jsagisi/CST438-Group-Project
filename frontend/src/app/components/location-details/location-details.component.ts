import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {
  
  id: string;
  location;
  private sub: any;
  dataLoaded;

  constructor(private route: ActivatedRoute, private mapService: MapService) { 
  
  this.location = {
    name: "",
    address: "",
    icon: null,
    players: [],
    activity: "",
    date: null
    };
    
    this.dataLoaded = false;
    
  };

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      
      this.location = this.mapService.getMarkerById(this.id);
      this.location.date = this.formatDate(new Date(this.location.date).toString());
      //this.location.date = new Date(this.location.date);
      console.log(this.location);
      
      this.dataLoaded = true;
    });
    
  }
  
  formatDate(str) {
    var date = str.slice(0,15);
    
    var hour = str.slice(15,18);
    var time;
    if (parseInt(hour) <= 12) {
      time = str.slice(15,21) + 'AM';
    }
    else {
      hour = parseInt(hour) - 12;
      var min = str.slice(18,21);
      time = hour  + min + 'PM';
    }
    return date + ' ' + time;
  }

}
