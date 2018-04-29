import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import * as firebase from "firebase";
import { UserService } from '../../services/user-service/user.service';
import { MapService } from '../../services/map/map.service';

import * as moment from 'moment';

@Component({
  selector: 'app-matches-ongoing',
  templateUrl: './matches-ongoing.component.html',
  styleUrls: ['./matches-ongoing.component.css']
})
export class MatchesOngoingComponent implements OnInit {


	//array  of every team
  teams: Array<any>;
  
  //subset of teams that are users teams
  usersTeams: Array<any>;
  
  //holds locations objects
  matches: Array<any>;

 	constructor(private mapService: MapService, public teamService: TeamService, private userService: UserService) { 4
  
  	this.teams = [];
  	this.usersTeams = [];
  	this.matches = [];
  
  }

  ngOnInit() {
  
  	//call teamService to get teams from database
    	this.teamService.downloadTeams()
    	.then((teams) => {
    	
    		//save all teams into array
			this.teams = teams;
		
			//find users teams
			for (var i = 0; i < teams.length;i++) {
				if (this.teamService.userInTeam(teams[i].id)) {
					this.usersTeams.push(teams[i]);
				}
			}
			
    	});
    	
    	//get user matches from database
    	this.teamService.getUserMatches()
    	.then((matches) => {
    		var today = moment().utc('-8:00').toISOString();
			
    		for (var i = 0; i < matches.length;i++) {
    			var matchDate = moment(matches[i].date).utc('-8:00').toISOString();
    			
    		
    			if (moment(today).isSameOrAfter(moment(matchDate)) == false) {
    				this.matches.push(matches[i]);
    			}
    		}
    		
    		this.matches.sort(function(a,b) {
    			var dateA = moment(a.date).utc('-8:00').toISOString();
    			var dateB = moment(b.date).utc('-8:00').toISOString();
    			
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

}
