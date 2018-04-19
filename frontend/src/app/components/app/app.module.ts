import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppBarComponent } from '../app-bar/app-bar.component';
import { ChatComponent } from '../chat/chat.component';
import { MapComponent } from '../map/map.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../../services/user-service/user.service';
import { LocationComponent } from '../locations/location/location.component';
import { MapService } from '../../services/map/map.service';
import { TeamService } from '../../services/team-service/team.service';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { TeamsHomeComponent } from '../teams-home/teams-home.component';
import { CreateTeamComponent } from '../teams-create/create-team.component';
import { TeamListComponent } from '../team-list/team-list.component';
import { UserTeamsComponent } from '../user-teams/user-teams.component';
import { JoinTeamComponent } from '../teams-join/join-team.component';
import { TeamMatchComponent} from "../team-match/team-match.component";
//routes
const appRoutes: Routes = [
	{ path: '', component: MapComponent },
	{ path: 'map', component: MapComponent, children: [
		{ path: 'search', component: LoginComponent},
		{ path: 'locations' , component: LocationComponent},
		{ path: 'locations/:id', component: LocationDetailsComponent }
		]
	},
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },

	{ path: 'teams', component: TeamsHomeComponent, children: [
		{ path: 'create', component: CreateTeamComponent },
		{ path: 'your-teams', component: UserTeamsComponent },
		{ path: 'join', component: JoinTeamComponent },
    {path: 'match', component: TeamMatchComponent}
	] }
];


@NgModule({
  declarations: [
    AppComponent,
    AppBarComponent,
    ChatComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    LocationComponent,
    LocationDetailsComponent,
    TeamsHomeComponent,
    CreateTeamComponent,
    TeamListComponent,
    UserTeamsComponent,
    JoinTeamComponent,
    TeamMatchComponent
  ],
  imports: [
  	 RouterModule.forRoot(appRoutes),
    BrowserModule,
    AgmCoreModule.forRoot({
    	apiKey: 'AIzaSyD5ABYjjcQFhwI65w8dtzhdBMIO-Zz2p7k',
    	libraries: ["places"]
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, MapService, TeamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
