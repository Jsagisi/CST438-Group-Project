import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, Validators} from '@angular/forms';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './components/app/app.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { ChatComponent } from './components/chat/chat.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './services/user-service/user.service';
import { LocationComponent } from './components/locations/location/location.component';
import { SandboxComponent} from "./components/sandbox/sandbox.component";
import { MapService } from './services/map/map.service';
import { TeamService } from './services/team-service/team.service';
import { ChatService } from './services/chat/chat.service';
import { LocationDetailsComponent } from './components/location-details/location-details.component';
import { TeamsHomeComponent } from './components/teams-home/teams-home.component';
import { CreateTeamComponent } from './components/teams-create/create-team.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { UserTeamsComponent } from './components/user-teams/user-teams.component';
import { JoinTeamComponent } from './components/teams-join/join-team.component';
import { TeamMatchComponent} from "./components/team-match/team-match.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDatetimepickerModule,MatNativeDatetimeModule} from "@mat-datetimepicker/core"
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatListModule, MatNativeDateModule, MatOptionModule,
  MatSelectModule,
  MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatchComponent } from "./components/matches/match.component";
import { MatchesOngoingComponent } from "./components/matches-ongoing/matches-ongoing.component";
import { MatchesCompletedComponent } from "./components/maches-completed/matches-completed.component";
import { MatchResultsComponent } from './components/match-results/match-results.component';
import {MomentModule} from "ngx-moment";

//routes
const appRoutes: Routes = [

	{ path: '', component: MapComponent },
	{ path: 'map', component: MapComponent, children: [
		{ path: 'search', component: LoginComponent},
		{ path: 'locations' , component: LocationComponent},
		{ path: 'locations/:id', component: LocationDetailsComponent }
		]
	},
	{ path: 'matches/:id', component: MatchResultsComponent },

  { path: 'sandbox', component: SandboxComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },

	{ path: 'teams', component: TeamsHomeComponent, children: [
		{ path: 'create', component: CreateTeamComponent },
		{ path: 'your-teams', component: UserTeamsComponent },
		{ path: 'join', component: JoinTeamComponent },
		{ path: 'matches', component: MatchComponent, children: [
			{ path: 'current', component: MatchesOngoingComponent },
			{ path: 'completed' , component: MatchesCompletedComponent }
		]},
    {path: 'match', component: TeamMatchComponent},
    {path: 'match/:locId/:teamId', component: TeamMatchComponent}
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
    TeamMatchComponent,
    SandboxComponent,
    MatchComponent,
    MatchesOngoingComponent,
    MatchesCompletedComponent,
    MatchResultsComponent,

  ],
  imports: [
  	 RouterModule.forRoot(appRoutes),
    BrowserModule,
    AgmCoreModule.forRoot({
    	apiKey: 'AIzaSyD5ABYjjcQFhwI65w8dtzhdBMIO-Zz2p7k',
    	libraries: ["places"]
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatDividerModule,
    MomentModule,
    MatListModule,
    MatCardModule,

  ],
  providers: [UserService, MapService, TeamService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
