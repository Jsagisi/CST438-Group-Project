import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import * as firebase from "firebase";
import { MapComponent } from '../map/map.component';
import { UserService } from '../../services/user-service/user.service';
import { } from 'googlemaps';
import { LocationComponent } from '../locations/location/location.component';
import { MapService } from '../../services/map/map.service';

import * as moment from 'moment';

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {


  private usersTeams:any[] = []; //array of all taems the user is on
  private allTeams:any[] = [];	//every team in the database
  private opponents:any[] = [];	//valid opponents for this users team
  location;	//selected event location
  date;	//date for event
  error: string = "";


  selectedUserTeam; //the team of the user
  selectedOpponent;

   //map stuff
   lat: 0;
   lng: 0;
   zoom: 5;
   mapType: string = 'roadmap';


  constructor(private mapService: MapService, public teamService: TeamService, private userService: UserService) {
    this.selectedUserTeam = null;
    this.selectedOpponent = null;
    this.location = null;

    var userCoords = this.userService.userCoords;
    this.lat = userCoords.lat;
    this.lng = userCoords.lng;

    this.date = moment().utc('-8:00').toISOString().slice(0, 16);
    this.location = {
      name: "",
      address: "",
    };
  }


    ngOnInit() {
      //call teamService = get teams from database
      this.teamService.downloadTeams()
        .then((teams: any[]) => {


          //save all teams into array
          this.allTeams = teams;

          //find users teams
          for (var i = 0; i < teams.length; i++) {
            if (this.teamService.userInTeam(teams[i].id)) {
              this.usersTeams.push(teams[i]);
            }
          }
          console.log(this.usersTeams);
        })


    }


    /*
        Event triggered on mouse click on map. Sends location name,
        coordinates, address from map
    */
    onLocationPicked(location)
    {

      this.location = location;
    }


    //called when value of user team select changes
    //when changes, call team service to get a list
    //of valid opponents for selected team
    userTeamChanged()
    {
      this.opponents = this.teamService.matchmaking(this.selectedUserTeam);

    }


    //called when select button on opponent is clicked
    setOpponent(id)
    {
      this.selectedOpponent = id;

      //change background of table for for selected opponent
      var row = document.getElementById(id);
      row.style.background = '#8bf27d';
    }


    /*
        Checks if all fields are given before submitting to database
    */
    formIsValid()
    {

      if (!this.selectedUserTeam || this.selectedUserTeam == "") {
        this.error = "You must choose which of your teams to play";
        return false;
      }

      if (!this.selectedOpponent || this.selectedOpponent == "") {
        this.error = "You must choose an opponent team";
        return false;
      }

      if (!this.location || this.location.name == "" || this.location.address == "" ||
        !this.location.coords || this.location.coords.lat == 0 || this.location.lng == 0) {

        this.error = "You must choose a location to host the event";
        return false;
      }


      this.error = "";
      return true;

    }


    /*
        Checks if all data given is valid then enters it into database
    */
    submit()
    {

      if (this.formIsValid()) {

        var usersTeam = this.teamService.getTeamById(this.selectedUserTeam);

        var oppTeam = this.teamService.getTeamById(this.selectedOpponent);

        var sport = usersTeam.sport;

        var players = usersTeam.members.concat(oppTeam.members);


        var date = moment(this.date).utc('-8:00').toISOString();


        var newMatch = {
          teams: {
            teamA: usersTeam,
            taemB: oppTeam
          },
          date: date,
          finished: false,
          winner: 'none',
          scores: {
            teamA: 0,
            teamB: 0
          },
          players: players
        };


        //make location object to insert into database
        var newLocation = {
          activity: sport,
          address: this.location.address,
          coords: this.location.coords,
          date: date,
          name: this.location.name,
          players: players,
          type: 'team',
          teams: {
            teamA: usersTeam,
            teamB: oppTeam
          },
          finished: false,
          winner: 'none'
        };

        this.userService.insertMatch(newMatch, newLocation);
        this.mapService.addLocation(newLocation);
      }

    }


  }



}
