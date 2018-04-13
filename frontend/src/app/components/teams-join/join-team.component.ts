import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.component.html',
  styleUrls: ['./join-team.component.css']
})
  
export class JoinTeamComponent implements OnInit {
  
  searchText:string;
  sportText:string;
  distance:number;

  constructor(private teamService: TeamService) { 
    
    //default values
    this.searchText = "";
    this.sportText = "all";
    this.distance = 50;
  
  }

  ngOnInit() {
    
    //call teamService = get teams from database
    this.teamService.downloadTeams()
    .then((teams) => {
      
    })
    
  }
  
  
  //calls teamService to return an array of filtered teams
  filterTeams() {
    console.log('value = ' + this.sportText);
    this.teamService.filter(this.searchText, this.sportText, this.distance);
  
  }
  
  //resets filters in team service
  resetFilter() {
    //reset models
    this.searchText = "";
    this.sportText = "";
    this.distance = 50;
    
    this.teamService.resetFilter();
  }
  
  
  
  //calls team service to add user to clicked on team
  addUserToTeam(id) {
    console.log(this.teamService.addUserToTeam(id));
  }

}
