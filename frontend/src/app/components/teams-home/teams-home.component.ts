import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-home',
  templateUrl: './teams-home.component.html',
  styleUrls: ['./teams-home.component.css']
})
export class TeamsHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  
  
  /* Navigates to given route when button clicked */
  navigate(path: string) : void {
  
    this.router.navigateByUrl('/' + path);
  }

}
