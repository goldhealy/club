import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableFilterService {

  private subject = new Subject<any>();

  distance: string = "";
  children: string = "";
  gender: string = "";
  category: string = "";

  constructor() { }

  onDistanceChange(distance: Number) {
   this.distance = distance.toString();
  //  const arr = this.matchAgainst.split('¤', 4);
  //  arr[0] = this.distance;
  //  this.matchAgainst = `${arr[0]}¤${arr[1]}¤${arr[2]}¤${arr[3]}¤`;
   this.sendEvent();
  }

  onChildrenChange(children: string) {
    
    this.children = children;


    // const arr = this.matchAgainst.split('¤', 4);
    // arr[1] = this.children;
    // this.matchAgainst = `${arr[0]}¤${arr[1]}¤${arr[2]}¤${arr[3]}¤`;
    this.sendEvent();
  }

  onGenderChange(gender: string) {
    this.gender = gender;

    // const arr = this.matchAgainst.split('¤', 4);
    // arr[2] = this.gender;
    // this.matchAgainst = `${arr[0]}¤${arr[1]}¤${arr[2]}¤${arr[3]}¤`;
    this.sendEvent();
  }

  onCategoryChange(category: string) {
    this.category = category;

    // const arr = this.matchAgainst.split('¤', 4);
    // arr[3] = this.category;
    // this.matchAgainst = `${arr[0]}¤${arr[1]}¤${arr[2]}¤${arr[3]}¤`;
    this.sendEvent();
  }

  sendEvent() {
    let matchAgainst = {};
    if (this.distance !== "") {
      matchAgainst = {...matchAgainst, distance: this.distance};
    }
    if (this.category !== "") {
      matchAgainst = {...matchAgainst, category: this.category};
    }
    if (this.gender !== "") {
      matchAgainst = {...matchAgainst, genderRatio: this.gender};
    }
    if (this.children !== "") {
      matchAgainst = {...matchAgainst, targetGroup: this.children};
    }
    this.subject.next(matchAgainst);
  }

  getEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  clearFilters() {
    this.category = "";
    this.gender = "";
    this.children = "";
    this.distance = "";
    this.sendEvent();
  }

}
