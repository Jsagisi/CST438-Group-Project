import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  username: string;
  password: string;
  errorMessage: string;

  constructor(private userService: UserService,
  			  private router: Router) { 
  	this.email = "";
  	this.username = "";
  	this.password = "";
  	this.errorMessage = "";
  }

  ngOnInit() {
  }
  
  
  formIsValid() : boolean {
  	
  	var passwordErr = document.getElementById('passwordErr');
  	var usernameErr = document.getElementById('usernameErr');
  	var emailErr = document.getElementById('emailErr');
  	
  	
  	if (this.username.length < 1 || this.password.length < 1 || this.email.length < 1) {
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
  		if (this.email.length < 1) {
  			emailErr.style.visibility='visible';
  			emailErr.innerHTML='Field Missing';
  		}else {
  			emailErr.style.visibility='hidden';
  		}
  		return false;
  	} 
  	else {
  		usernameErr.style.visibility='hidden';
  		passwordErr.style.visibility='hidden';
  		emailErr.style.visibility='hidden';
  		return true;
  	}
  	
  }
  
  
  submit() {
  	if (this.formIsValid() == true) {
  		var registerErr = document.getElementById('registerErr');
  		this.userService.registerUser(this.email, this.password, this.username, (err, res) => {
  			if (err != null) {
  				console.log(err);
  				this.errorMessage = err.message;
  				registerErr.style.visibility='visible';
  			}
  			else {
  			console.log('success');
  				console.log(res);
  				registerErr.style.visibility='hidden';
  				this.router.navigateByUrl('/');
  			}
  		});
  	}
  	else {
  	
  	}
  }

}
