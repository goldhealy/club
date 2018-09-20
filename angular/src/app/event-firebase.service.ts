import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from '../../node_modules/rxjs';
import { AngularFireDatabase, AngularFireList  } from '../../node_modules/angularfire2/database';
import { Time } from '@angular/common';
import { timestamp } from 'rxjs/internal/operators/timestamp';

// Entity
import { Event } from './entity/event/event.model';
import { JsonConverter } from './entity/helper/json-converter';

@Injectable({
  providedIn: 'root'
})
export class EventFirebaseService {

  dbPath: string = '/events/';
  jsonConverter: JsonConverter = new JsonConverter();

  eventsObservable: Observable<any[]>;
  event: Event;

  testMail = "ramonariley@equitax.com";

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  getEvents() {
    this.eventsObservable = this.getList(this.dbPath);
  }

  getList(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

  getEventByKey(key: string) {
    let path = this.dbPath + key
    this.db.object(path).valueChanges().subscribe(data => {
      this.event = this.jsonToObj(JSON.stringify(data));
    });
  }

  getEventsByHost(hostMail: string): Observable<any[]> {
    let path = this.dbPath;
    return this.db.list(path, ref => ref.orderByChild('host').equalTo(this.testMail)).valueChanges();
  }

  insertEvent(event: Event) {
    const entry = this.objToJSON(event);
    this.db.list(this.dbPath).push(event);
  }

  updateEvent(key: string, event: Event) {
    const eventsRef = this.db.list(this.dbPath);
    eventsRef.set('key', event);
  }

  deleteEvent(key: string) {
    const itemsRef = this.db.list(this.dbPath);
    itemsRef.remove(key);
  }

  joinEvent(key: string, username: string) {
    this.db.object(this.dbPath+"/"+key+"/participants").update('username');
  }

  leaveEvent(key: string, username: string) {
    const itemRef = this.db.object(this.dbPath+"/"+key+"participants/"+username);
    itemRef.remove();
  }

  generateNewHashKey(username: string,  title: string): string {
    const date: Date = new Date();
    const stringify = username + "_" + date.getHours() + ":" + this.addZeroesToTime(date.getMinutes()) + "_" + title;
    return stringify;
  }

  private addZeroesToTime(input: number): any {
    return input < 10 ? "0" + input : input;
  }

  objToJSON(eventObject : Event): string {
    return JSON.parse(JSON.stringify(eventObject));
  }

  
  jsonToObj(json: string): Event {
    return this.jsonConverter.convertJsonToEventObj(json);
  } 

}