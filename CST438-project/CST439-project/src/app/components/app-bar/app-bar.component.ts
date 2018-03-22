import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {

  isLoggedIn: string;

  constructor(private router: Router,
  			  private userService: UserService) { 
  	
  	this.isLoggedIn = 'Login';
  }

  ngOnInit() {
  
  	if (this.userService.isLoggedIn() == true) {
  		this.isLoggedIn = 'Logout';
  	}
  	else {
  		this.isLoggedIn = 'Login';
  	}	
  
  }
  
  navigateTo(path: string) : void {
  	this.router.navigateByUrl('/' + path);
  }
  
  logout() {
  	this.userService.logoutUser((err, res) => {
  		if (err != null ) {
  			console.log(err.message);
  		}
  		else {
  			this.router.navigateByUrl('/');
  		}
  	});
  }

}
