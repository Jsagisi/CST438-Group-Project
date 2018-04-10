import { Component, OnInit, Input } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  @Input() team;
  displayMembers: boolean;

  constructor(private teamService: TeamService, private userService: UserService) { 
    this.team = {
      name: "",
      id: "",
      imgUrl: "",
      img: null,
      wins: 0,
      losses: 0,
      members: [],
      owner: {},
      sport: ""
    };
    
    this.displayMembers = false;
  }

  ngOnInit() {
   //call teamService = get teams from database
    this.teamService.downloadTeams()
    .then((teams) => {
      
    })
  }
  
  
  //toggles displayMembers to show/hide team member list
  showMembers() {
    this.displayMembers = !this.displayMembers;
  }
  
  
  
  removeUserFromTeam(id) {
    
    var uid = this.userService.getUser().uid;
    console.log(uid);
    this.teamService.removeUserFromTeam(id, uid);
  }

}
