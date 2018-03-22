import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppBarComponent } from '../app-bar/app-bar.component';
import { HomeComponent } from '../home/home.component';
import { ChatComponent } from '../chat/chat.component';
import { MapComponent } from '../map/map.component';
import { MenuComponent } from '../menu/menu.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../../services/user-service/user.service';


//routes
const appRoutes: Routes = [
	{ path: '', component: MapComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    AppBarComponent,
    HomeComponent,
    ChatComponent,
    MapComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
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
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
