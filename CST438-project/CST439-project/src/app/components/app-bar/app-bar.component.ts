import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {

  constructor(private router: Router) { 
  }

  ngOnInit() {
  }
  
  navigateTo(path: string) : void {
  	this.router.navigateByUrl('/' + path);
  }

}
