import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateNewEventComponent } from '../../create-new-event/create-new-event.component';
import { MobileDetectorService } from '../../mobile-detector.service';
import { window } from 'rxjs/operators';
import { NewEventComponent } from '../new-event/new-event.component';
import { Router } from '@angular/router';

@Component({
  selector: 'event-control-menu',
  templateUrl: './event-control-menu.component.html',
  styleUrls: ['./event-control-menu.component.css']
})
export class EventControlMenuComponent implements OnInit {

  @Output() showAllEvents = new EventEmitter();
  @Output() showMyEvents = new EventEmitter();
  @Output() showPastEvents = new EventEmitter();
  @Output() showJoinedEvents = new EventEmitter();

  dialogWidth = screen.width / 0.9 + "px";
  dialogHeight = screen.height / 1.75 + "px";
  allEventsShown: boolean = true;
  myEventsShown: boolean = false;
  pastEventsShown: boolean = false;
  joinedEventsShown: boolean = false;

  constructor(
    public dialog: MatDialog, 
    private mds: MobileDetectorService,
    private router: Router, 
    ) { }

  ngOnInit() {
    console.log({wid: screen.width})
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewEventComponent, {
      width: this.dialogWidth,
      panelClass: "new-event-panel"
    });

    dialogRef.componentInstance.onEventCreated.subscribe(key => {
      this.router.navigate(['/view-event'], {queryParams: {key}})
    });
  }

  clearAll() {
    this.allEventsShown = false;
    this.myEventsShown = false;
    this.pastEventsShown = false;
    this.joinedEventsShown = false;
  }

  displayAllEvents() {
    this.clearAll();
    this.allEventsShown = true;
    this.showAllEvents.emit(this.allEventsShown);
  }

  displayMyEventsOnly() {
    this.clearAll();
    this.myEventsShown = true;
    this.showMyEvents.emit(this.myEventsShown);
  }

  displayPastEvents() {
    this.clearAll();
    this.pastEventsShown = true;
    this.showPastEvents.emit(this.pastEventsShown);
  }

  displayJoinedEvents() {
    this.clearAll();
    this.joinedEventsShown = true;
    this.showJoinedEvents.emit(this.joinedEventsShown);
  }

}
