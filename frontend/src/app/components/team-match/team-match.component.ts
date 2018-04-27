import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import * as firebase from "firebase";
import { MapComponent } from '../map/map.component';
import { UserService } from '../../services/user-service/user.service';
import { } from 'googlemaps';
import { LocationComponent } from '../locations/location/location.component';

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {

  usersTeams = []; //array of all taems the user is on
  allTeams = [];	//every team in the database
  opponents = [];	//valid opponents for this users team
  location;	//selected event location 
  date;	//date for event
  
  selectedUserTeam; //the team of the user
  selectedOpponent;
  
   //map stuff
   lat: 0,
   lng: 0,
   zoom: 5,
   mapType: string = 'roadmap';
    
  constructor(public teamService: TeamService, private userService: UserService) {
   this.selectedUserTeam = null;
   this.selectedOpponent = null;
   
   var userCoords = this.userService.userCoords;
   this.lat = userCoords.lat;
   this.lng = userCoords.lng;
   
  
  }

  ngOnInit() {
    //call teamService = get teams from database
    this.teamService.downloadTeams()
    .then((teams) => {
    
    	//save all teams into array
		this.allTeams = teams;
		
		//find users teams
		for (var i = 0; i < teams.length;i++) {
			if (this.teamService.userInTeam(teams[i].id) {
				this.usersTeams.push(teams[i]);
			}
		}
		console.log(this.usersTeams);
    })
    
    
    
  }
  
  
  submit(location) {
  	console.log(location);
  }
  
  
  
  //called when value of user team select changes
  //when changes, call team service to get a list
  //of valid opponents for selected team
  userTeamChanged() {
  	this.opponents = this.teamService.matchmaking(this.selectedUserTeam);
  	
  }
  
  
  //called when select button on opponent is clicked
  setOpponent(id) {
  	this.selectedOpponent = id;
  }
  
  
  
  
	

}
