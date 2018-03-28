import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class MapService {

  private clickEvent = new Subject<any>();
  private searchMarkerChangedEvent = new Subject<any>();

  
  emitClickEvent(type: any) {
    console.log('emit ' + type);
  	this.clickEvent.next({text: type});
  }
  
  getClickEvent(): Observable<any> {
    console.log('get');
  	return this.clickEvent.asObservable();
  }
  
  
  searchMarkerChanged(newMarker) {
  	this.searchMarkerChangedEvent.next({marker: newMarker});
  }
  
  getSearchMarkerEvent() : Observable<any> {
  	return this.searchMarkerChangedEvent.asObservable();
  }

  constructor() { }

}
