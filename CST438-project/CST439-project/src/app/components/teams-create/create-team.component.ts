import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  
  teamLogo: File;
  url: string;
  teamName: string;
  sport: string;
  database; //database ref
  storage; //storage ref
  response: string;
  

  constructor(private userService: UserService) { 
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
  }
  
  /* Gets image from HTML file input */
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.teamLogo = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.url = e.target.result;
      }
    }
  }
  
  /* Check that all fields in the form are not empty befoe submittinf data */
  formIsValid(callback){
    var self = this;
    var ref = this.database.ref('/teams');
    var found = false;
    
    //iterate through teams in db to see if it exists
    ref.once('value', function(snapshot) {
      
      snapshot.forEach(function(dataSnap) {
        var data = dataSnap.val();
        
        //team name found
        if (data.name == self.teamName) {
          found = true;
          
        }
      });
      
      //missing fields return invalid
      if (!self.teamName || !self.url || !self.teamLogo ||
          !self.sport) {
        self.response = "Error: Fields missing";
        callback(false);
      }
      //name found return invalid
      else if (found == true) {
        self.response = "Team name is taken";
       callback(false);
      }
        //return valid
      else {
        
        callback(true);
      }
    });
  }
  
 
  submit() {
   
   //reset response messege
    this.response = "";
    var responseSpan = document.getElementById('response');
    responseSpan.classList.remove('error');
    responseSpan.classList.add('success');
    
    //check validity before adding
    this.formIsValid((res) => {
      
      //form valid so add team to db
      if (res == true) {
        //get currently logged in to to make them the team leader
        var user = this.userService.getUser();
      
        //create team object to insert into database
        var team = {
          name: this.teamName,
          owner: user,
          members: [user],
          sport: this.sport,
          id: "",
          wins: 0,
          losses: 0,
          imgUrl: 'teamLogos/' + this.teamName + '/' + this.teamLogo.name
        };
      
        //insert team logo into storage
        var storageRef = this.storage.ref();
        var imgRef = storageRef.child('teamLogos/' + this.teamName + '/' + this.teamLogo.name);
        imgRef.put(this.teamLogo).then((snapshot) => {
        
        });
      
        //insert new team into database
        var newTeamRef = this.database.ref('/teams').push();
        var id = newTeamRef.key;
        team.id = id;
        newTeamRef.set(team);
        
        //display successfull response
        this.response = "Team Created Successfully";
        var responseSpan = document.getElementById('response');
        responseSpan.classList.remove('error');
        responseSpan.classList.add('success');
      }
      //form invalid show error response
      else {
        var responseSpan = document.getElementById('response');
        responseSpan.classList.remove('success');
        responseSpan.classList.add('error');
      }
    });
    
    
  }
  


}
