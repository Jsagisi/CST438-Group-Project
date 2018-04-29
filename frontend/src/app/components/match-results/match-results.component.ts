import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../../services/map/map.service';
import { TeamService } from '../../services/team-service/team.service';

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.css']
})
export class MatchResultsComponent implements OnInit {

  match: any;
  id: string;

  constructor(private teamService: TeamService,private route: ActivatedRoute, private mapService: MapService) { 
  
  	this.match = null;
  	this.id = "";
  
  }

  ngOnInit() {
  
  	this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      
      
      //get user matches from database
    	this.teamService.getUserMatches()
    	.then((matches) => {
    		
			
    		for (var i = 0; i < matches.length;i++) {
    			if (matches[i].id == this.id) {
    				this.match = matches[i];
    				
    			}
    		}
    		
    		
    		
    	});
      
    });
  
  }

}
