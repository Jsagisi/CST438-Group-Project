import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppBarComponent } from '../app-bar/app-bar.component';
import { HomeComponent } from '../home/home.component';
import { ChatComponent } from '../chat/chat.component';
import { MapComponent } from '../map/map.component';
import { MenuComponent } from '../menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    AppBarComponent,
    HomeComponent,
    ChatComponent,
    MapComponent,
    MenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
    	apiKey: 'AIzaSyD5ABYjjcQFhwI65w8dtzhdBMIO-Zz2p7k',
    	libraries: ["places"]
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
