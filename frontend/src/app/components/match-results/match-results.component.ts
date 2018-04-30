import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../../services/map/map.service';
import { TeamService } from '../../services/team-service/team.service';

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.css']
})
export class MatchResultsComponent implements OnInit {

  match: any;
  id: string;
  winner:any; //team object of winning team
  teamAScore:number;
  teamBScore:number;

  constructor(private teamService: TeamService,private route: ActivatedRoute, private mapService: MapService) { 
  
  	this.match = null;
  	this.id = "";
  	
  	this.winner null;
  	this.teamAScore = 0;
  	this.teamBScore = 0;
  
  
  }

  ngOnInit() {
  
  	this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      
      
      //get user matches from database
    	this.teamService.getUserMatches()
    	.then((matches) => {
    		
			
    		for (var i = 0; i < matches.length;i++) {
    			if (matches[i].id == this.id) {
    				this.match = matches[i];
    				
    			}
    		}
    		
    		
    		
    	});
      
    });
  
  }
  
  
  //checks if user entered info is valid before submitting to database
  formIsValid(): boolean {
  	return this.winner == null ? false : true;
  }
  
  
  submitMatchResults() {
  
  	if (this.formIsValid()) {
 		
 		//find which team won by comparing id
 		var winningTeam;
 		var losingTeam;
 		if (this.winner == this.match.teams.teamA.id) [
 			winningTeam = this.match.teams.teamA;
 			losingTeam = this.match.teams.teamB;
 		}
 		else {
 			winningTeam = this.match.teams.teamB;
 			losingTeam = this.match.teams.teamA;
 		}
 		
 		//set winner field of location object
 		this.match.winner = winningTeam;
 		
 		//put new score field in location object
 		var score = {
 			teamA: this.teamAScore,
 			teamB: this.teamBScore
 		};
 		
 		//update team records for both teams
 		winningTeam.wins = parseInt(winningTeam.wins) + 1;
 		losingTeam.losses = parseInt(losingTeam.losses) + 1;
 		
 		this.match.score = score;
 		this.match.finished = true;
 		
 		this.teamService.updateMatch(this.match);
 		this.teamService.updateTeam(winningTeam);
 		this.teamService.updateTeam(losingTeam);
 		
  	}
  }

}
