import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  
  }
  
  
  formIsValid() : boolean {
  	
  	var passwordErr = document.getElementById('passwordErr');
  	var usernameErr = document.getElementById('usernameErr');
  	const username = document.getElementById('username').value;
  	const password  = document.getElementById('password').value;
  	
  	if (username.length < 1 || password.length < 1) {
  		if (username.length < 1) {
  			usernameErr.style.visibility='visible';
  			usernameErr.innerHTML='Field Missing';
  		} else {
  			usernameErr.style.visibility='hidden';
  		}
  		if (password.length < 1) {
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
  		// TODO Implement database check
  	}
  	else {
  		
  	}
  }

}
