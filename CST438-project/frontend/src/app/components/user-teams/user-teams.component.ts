import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.css']
})
export class UserTeamsComponent implements OnInit {
  
  database;
  storage;
  teams;

  constructor(private userService: UserService) { 
    
    this.database = firebase.database();
    this.storage = firebase.storage();
    
    this.teams = new Array();
  
  }

  ngOnInit() {
    
    //get the users teams from firebase
    var ref = this.database.ref('/teams');
    var self = this;
    //iterate through teams in db to see if it exists
    ref.once('value', function(snapshot) {
      
      snapshot.forEach(function(dataSnap) {
        var data = dataSnap.val();
        
        var newTeam;
        var members = data.members;
        for (var i = 0; i < members.length;i++) {
          if (members[i].displayName == self.userService.getUser().displayName) {
            newTeam = data;
            
            //get team icon
            var imgRef = self.storage.ref(data.imgUrl).getDownloadURL()
            .then(function(url) {
              newTeam.imgUrl = url;
            })
            self.teams.push(newTeam);
          }
        }
      });
      console.log(self.teams);
     });
 
    
  }

}
