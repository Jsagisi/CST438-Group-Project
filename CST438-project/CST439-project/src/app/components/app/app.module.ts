import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
