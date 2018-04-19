import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service/team.service';
import * as firebase from "firebase";

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {

    teamLogo: File;
    url: string;
    teamName: string;
    sport: string;
    database; //database ref
    storage; //storage ref
    response: string;

  constructor(private teamService: TeamService) {
    this.url = "";
    this.teamLogo = null;
    this.teamName = "";
    this.sport = "";
    this.response = "";

    //instantiate database object
    this.database = firebase.database();
    this.storage = firebase.storage();
  }

  ngOnInit() {
    this.teamService.downloadTeams()
      .then((teams) => {

      })
  }

}
