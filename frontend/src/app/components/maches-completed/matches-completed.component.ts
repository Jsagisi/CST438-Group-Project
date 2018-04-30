import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import * as firebase from "firebase";
import { UserService } from '../../services/user-service/user.service';
import { MapService } from '../../services/map/map.service';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-matches-completed',
  templateUrl: './matches-completed.component.html',
  styleUrls: ['./matches-completed.component.css']
})
export class MatchesCompletedComponent implements OnInit {

  //array  of every team
  teams;

  //subset of teams that are users teams
  usersTeams;

  //holds locations objects
  matches;

  //utc offset for pst time zone
  offset:string = "-8:00";

 	constructor(private router: Router,private mapService: MapService, public teamService: TeamService, private userService: UserService) { 4

  	this.teams = [];
  	this.usersTeams = [];
  	this.matches = [];

  }

  ngOnInit() {

  	//call teamService to get teams from database
    	this.teamService.downloadTeams()
    	.then((teams:Array<any>) => {

    		//save all teams into array
			this.teams = teams;

			//find users teams
			for (var i = 0; i < teams.length;i++) {
				if (this.teamService.userInTeam(teams[i].id)) {

					this.usersTeams.push(teams[i]);
				}
			}

    	});

      var self = this;
    	//get user matches from database
    	this.teamService.getUserMatches()
    	.then((matches) => {

    		var today = moment().utc(self.offset).toISOString();

			//only get matches where the start date has passed
    		for (var i = 0; i < matches.length;i++) {
    			var matchDate = moment(matches[i].date).utc(self.offset).toISOString();

    			//built in momentjs function checks if date passed
    			if (moment(today).isSameOrAfter(moment(matchDate))) {
    				this.matches.push(matches[i]);
    			}
    		}

    		//sort dates ascending

    		this.matches.sort(function(a,b) {
    			var dateA = moment(a.date).utc(self.offset).toISOString();
    			var dateB = moment(b.date).utc(self.offset).toISOString();

    			return (dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0);
    		});

    		//format dates a little nices than ISO.
    		//YYYY-MM-dd HH: MM
    		for (var i = 0; i < this.matches.length;i++) {
    			var date = this.matches[i].date;


    			//get time
    			var hour = parseInt(date.slice(11,13));

    			if (hour < 12) {


    				date = date.slice(0,10) + ' ' + date.slice(11,16) + ' AM';
    			}
    			else {
    				hour = hour - 12;
    				date = date.slice(0,10) + ' ' + hour + date.slice(13,16) + ' PM';
    			}

    			this.matches[i].date = date;
    		}

    	});

  }


  gotoMatchDetails(id) {
  	this.router.navigate(['/matches',id]);
  }
}
