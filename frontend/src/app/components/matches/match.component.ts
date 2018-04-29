import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  
  /* Navigates to given route when button clicked */
  navigate(path: string) : void {
  
    this.router.navigateByUrl('/' + path);
  }

}
