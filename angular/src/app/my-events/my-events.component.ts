import { Component, OnInit, ViewChild  } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { EventFirebaseService } from '../event-firebase.service';
import { MobileDetectorService } from '../mobile-detector.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFirebaseService } from '../user-firebase.service';
import { Event } from '../entity/event/event.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { CreateNewEventComponent } from '../create-new-event/create-new-event.component';

export interface EventData {
  name: string;
  address: string;
  distance: number;
  genderRatio: string;
  targetGroup: boolean;
  available: number;
  actions: string;
}

export interface EventDataMobile {
  name: string;
  address: string;
  available: number;
  actions: string;
}

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  isMobile = false;
  error = "";

  dataSource = new MatTableDataSource<EventData>();
  displayedColumns = ['name', 'address', 'distance', 'category', 'genderRatio', 'targetGroup', 'available', 'actions'];
  dataSourceMobile = new MatTableDataSource<EventDataMobile>();
  displayedColumnsMobile = ['name', 'address', 'available', 'actions'];

  events = [];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private efbs: EventFirebaseService, private mds: MobileDetectorService,
    private spinner: NgxSpinnerService, private ufbs: UserFirebaseService,
    public dialog: MatDialog, private authService: AuthService, private router: Router) {

    }

  ngOnInit() {
    this.spinner.show();
    this.isMobile = this.mds.check();
    this.renderTableIntoView();
  }

  ngAfterViewInit() {
    setTimeout( ()=>{
      if (this.events.length < 1) {
        this.spinner.hide();
        this.error = "Du har ikke oprettet et event endnu.";
      }
      }, 3000)
  }

  onEditClick(event) {
    // let e: Event = element;
    // this.efbs.myEventSelection = e;
    const dialogRef = this.dialog.open(CreateNewEventComponent, {
      width: screen.width / 1.25 + "px",
      data: {event: event, stepIndex: 0, eventKey: event.key}
    });
  }

  publishEvent(event) {
    
  }

  onDeleteClick(element) {
    this.efbs.deleteEvent(element.key);
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {e: element, key: element.key, buttonNo: "For Guds skyld nej!", buttonYes: "Ja", dialogText: "Er du sikker på at du vil slette dette event?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderTableIntoView();
    });
  }

  private removePastEvents() {
    this.events.forEach( event => {
      if (new Date(event.dateStart) < new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() + 1))) {
        let idx = this.events.indexOf(event, 0);
        if (idx > -1) {
          this.events.splice(idx, 1);
        }
      }
    });
  }

  applyFilter(eventTargetValue: string) {
    this.dataSource.filter = eventTargetValue.trim().toLowerCase();
    this.dataSourceMobile.filter = eventTargetValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSourceMobile.paginator.firstPage();
    }
  }

  onViewClick(element) {
    let e: Event = element;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "key": e.key
      }
    }
    this.router.navigate(['/view-event'], navigationExtras);
  }

  renderTableIntoView() {
    let observer = this.efbs.getEventsByHost(this.authService.afAuth.auth.currentUser.uid).subscribe(res => {
      this.events = res;
      Object.keys(this.events).forEach( (event:any) => {
        this.events[event] = {...this.events[event], participantCount: Object.keys(this.events[event].participants).length};
        
      });
      this.removePastEvents();
      
      this.dataSource = new MatTableDataSource(this.events);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceMobile = new MatTableDataSource(this.events);
      this.dataSourceMobile.paginator = this.paginator;
      this.dataSourceMobile.sort = this.sort;
      this.spinner.hide();
      // observer.unsubscribe();
    });
  }

}
