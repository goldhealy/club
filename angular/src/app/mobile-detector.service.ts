import { Injectable, Component } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectorService {

  constructor() { }

  check(w=900): boolean {
    return window.screen.width <= w;
  }

  isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

}
