import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  username: string;
  password: string;
  errorMessage: string;
  
  constructor(private userService: UserService,
  			  private router: Router
  ) { 
  
  	this.username = "";
  	this.password = "";
  	this.errorMessage = "";
  
  
  }

  ngOnInit() {
  
  }
  
  
  
  
  formIsValid() : boolean {
  	
  	var passwordErr = document.getElementById('passwordErr');
  	var usernameErr = document.getElementById('usernameErr');
  	
  	
  	if (this.username.length < 1 || this.password.length < 1) {
  		if (this.username.length < 1) {
  			usernameErr.style.visibility='visible';
  			usernameErr.innerHTML='Field Missing';
  		} else {
  			usernameErr.style.visibility='hidden';
  		}
  		if (this.password.length < 1) {
  			passwordErr.style.visibility='visible';
  			passwordErr.innerHTML='Field Missing';
  		} else {
  			passwordErr.style.visibility='hidden';
  		}
  		return false;
  	} 
  	else {
  		usernameErr.style.visibility='hidden';
  		passwordErr.style.visibility='hidden';
  		return true;
  	}
  	
  }
  
  
  submit() : void {
  	if (this.formIsValid() == true ) {
  		this.userService.signInUser(this.username, this.password, (err,res) => {
  			if (err != null) {
  			console.log('in err');
  				var loginErr = document.getElementById('loginErr');
  				switch (err.code) {
  					case 'auth/wrong-password' :
  						this.errorMessage = "Incorrect email or password";
  						break;
  					case 'auth/invalid-email' :
  						this.errorMessage = err.message;
  						break;
  					default:
  						this.errorMessage = 'Error logging in';
  						
  				}
  				loginErr.style.visibility='visible';
  			}
  			else {
  			console.log('not in err');
  				var loginErr = document.getElementById('loginErr');
  				loginErr.style.visibility='hidden';
  				this.router.navigateByUrl('/');
  			}
  		});
  		
  	}
  	else {
  		
  	}
  }

}
