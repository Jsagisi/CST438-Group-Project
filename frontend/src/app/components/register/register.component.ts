import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import {FormControl,Validators} from "@angular/forms";
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  email: FormControl;
  username: FormControl;
  password: FormControl;
  submissionError:String=null;

  getEmailError() {
    //Gross way to do this.
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  getPasswordError() {
    //Gross way to do this.
    return this.password.hasError('required') ? 'You must enter a value' :
      this.password.hasError("minlength")?'Password must be at least 6 characters':
        '';
  }
  getUsernameError(){


    //     //Gross way to do this.
    return this.username.hasError('required') ? 'You must enter a value' :
      this.password.hasError("minlength")?'Username must be at least 1 characters':
        '';
  }
  constructor(private userService: UserService,
  			  private router: Router) {
  	this.email=new FormControl('',[Validators.email,Validators.required])
  	this.username = new FormControl('',[Validators.required,Validators.minLength(1)]);
  	this.password = new FormControl('',[Validators.required,Validators.minLength(6)]);

  }

  ngOnInit() {
  }


  formIsValid() : boolean {

    return this.email.valid&&this.password.valid&&this.username.valid;


  }


  submit() {
    this.submissionError=null
  	if (this.formIsValid() == true) {

  		this.userService.registerUser(this.email.value, this.password.value, this.username.value, (err, res) => {
  			if (err != null) {
  				console.log(err);
  				console.log("Hit an error")
  				this.submissionError = err.message;
  			}
  			else {
  			console.log('success');
  				console.log(res);
  				this.router.navigateByUrl('/');
  			}
  		});
  	}
  	else {

  	}
  }

}
