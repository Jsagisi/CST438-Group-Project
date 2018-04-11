import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UserService } from '../user-service/user.service';

@Injectable()
export class TeamService {
  
  //array of all team in database
  teams;
  //subset of filtered teams
  filteredTeams;
  isFiltering = false;
  database;
  storage;

  
  
  
  constructor(private userService: UserService) { 
    
    this.teams = new Array();
    this.database = firebase.database();
    this.storage = firebase.storage();
    
  }
  
  
  
  
  
  ngOnInit() {
    
    //load teams from database
   this.downloadTeams()
    .then((teams) => {
      this.teams = teams;
    });
  }
  
  
  
  
  //calls database to get all team object and their logos
  downloadTeams() {
    var self = this;
    self.teams = new Array();
    return new Promise(function(resolve,reject) {
    
    var ref = self.database.ref('/teams');
    
    //search for all teams
    var teams = new Array();
    //iterate through teams in db to see if it exists
    ref.once('value', function(snapshot) {
      
      //intereate through each team to get image url
      snapshot.forEach(function(dataSnap) {
        var data = dataSnap.val();
        
        var newTeam = data;
        //get team icon with the image url
            var imgRef = self.storage.ref(data.imgUrl).getDownloadURL()
            .then(function(url) {
              newTeam.imgUrl = url;
            })
            teams.push(newTeam);
      });
      self.teams = teams;
      resolve(teams);
     });
    });
  }
  
  
  
  
  //return distance in Km between 2 points
  calculateDistance(lat1, long1, lat2, long2) {    

      //radians
      lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;      
      long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;    
      lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;   
      long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;       


      // use to different earth axis length    
      var a = 6378137.0;        // Earth Major Axis (WGS84)    
      var b = 6356752.3142;     // Minor Axis    
      var f = (a-b) / a;        // "Flattening"    
      var e = 2.0*f - f*f;      // "Eccentricity"      

      var beta = (a / Math.sqrt( 1.0 - e * Math.sin( lat1 ) * Math.sin( lat1 )));    
      var cos = Math.cos( lat1 );    
      var x = beta * cos * Math.cos( long1 );    
      var y = beta * cos * Math.sin( long1 );    
      var z = beta * ( 1 - e ) * Math.sin( lat1 );      

      beta = ( a / Math.sqrt( 1.0 -  e * Math.sin( lat2 ) * Math.sin( lat2 )));    
      cos = Math.cos( lat2 );   
      x -= (beta * cos * Math.cos( long2 ));    
      y -= (beta * cos * Math.sin( long2 ));    
      z -= (beta * (1 - e) * Math.sin( lat2 ));       

      return (Math.sqrt( (x*x) + (y*y) + (z*z) )/1000);  
  }
  
  
  
  
  kmToMiles(km:number) {
    return km / 1.609344;
  }

  
  
  
  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
  
  
  
  //returns array of teams
  //if filtering returns subset of teams that fall into the filter
  //if not filtering just returns all teams
  getTeams() {
    if (this.isFiltering) {
      return this.filteredTeams;
    }
    else {
      return this.teams;
    }
  }
  
  
  
  
  
  resetFilter() {
    this.isFiltering = false;
    
  }
  
  
  
  /*
   * Filter teams from database according to name, type, and distance
   * if parameters given then sets isFiltering to true
   */
  filter(name:string, sport:string, dist:number) {
    
    //reset filter array
    this.filteredTeams = new Array();
    
    var self = this;
    
    //no parameters given so not filtering
    if (!name && !sport) {
      this.isFiltering = false;
     
    }
    
    //parameters given so is filtering
    this.isFiltering = true;
    
    //first filter by distance parameter
    this.filteredTeams = this.teams.filter(function(team) {
         
         //location of team
         var teamCoords = {
           lat: team.location.lat,
           lng: team.location.lng
         };
        //location of user
         var userCoords = self.userService.userCoords;
         
         //calculate distance between user and team
         var distKm = self.calculateDistance(
           userCoords.lat,
           userCoords.lng,
           teamCoords.lat,
           teamCoords.lng);
         var distMiles = self.kmToMiles(distKm);
         
         //if distance less than parameter then add it to list
         return distMiles <= dist;
         
      }); 
    
    //filter by name of team
    if (name) {
      
      this.filteredTeams = this.teams.filter(team => 
       
        team.name == name
      );
      //filter teams with given name by sport
      if (sport && sport != "all") {
        
        this.filteredTeams = this.filteredTeams.filter(team => 
          team.sport == sport
        );
        
       }
       return;
    }
    //filter teams by sport
    if (sport && sport != "all") {
       
        this.filteredTeams = this.teams.filter(team => 
          team.sport == sport
        );
       //next filter by name
        if (name) {
          this.filteredTeams = this.filteredTeams.filter(team => 
            team.name == name
          );
        }

      return;
        
     }
     
    
  }
  
  
  
  /*
   * Adds user to a given team by team id
   * 
   * Returns true if user added successfully 
   * or false otherwise
   */
  addUserToTeam(teamId:string): boolean {
    
    var team;
    //check if team id exists
    for (var i = 0; i < this.teams.length;i++) {
      if (this.teams[i].id == teamId) {
        team = this.teams[i];
      }
    }
    
    //team not found
    if (!team) {
      return false;
    }
    
    //check if user is already in team
    var user = this.userService.getUser();
    
    //user not found
    if (!user) {
      return false;
    }
    
    for (var i = 0; i < team.members.length;i++) {
      if (team.members[i].uid == user.uid) {
        return false;
      }
    }
    
    var members = team.members;
    members.push(user);
    
    this.database.ref('/teams/' + teamId)
    .update({members: members});
    
    return true;
    
    
  }
  
  
  
  //checks if user is already in a team
  userInTeam(teamId:string): boolean {
    var team;
    //get team object of given id
    for (var i = 0; i < this.teams.length;i++) {
      if (this.teams[i].id == teamId) {
        team = this.teams[i];
      }
    }
    
    //check if user is already in team
    var user = this.userService.getUser();
    
    //user not found
    if (!user) {
      return true;
    }
    
    for (var i = 0; i < team.members.length;i++) {
      if (team.members[i].uid == user.uid) {
        return true;
      }
    }
    
    return false;
    
    
  }
  
  
  
  removeUserFromTeam(teamId:string, userId:string) {
    var self = this;
    var ref = this.database.ref('/teams/' + teamId);
    ref.once('value', (snapshot) => {
        var team = snapshot.val();
        for (var i = 0; i < team.members.length;i++) {
          if (team.members[i].uid == userId) {
            ref.child('members/' + i).remove();
          }
        }
    });
  }
  
  

}
