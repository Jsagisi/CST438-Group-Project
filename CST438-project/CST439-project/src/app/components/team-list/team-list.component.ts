import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  @Input() team;
  displayMembers: boolean;

  constructor() { 
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
   
  }
  
  
  //toggles displayMembers to show/hide team member list
  showMembers() {
    this.displayMembers = !this.displayMembers;
  }

}
