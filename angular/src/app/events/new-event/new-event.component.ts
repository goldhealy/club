import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeoCodingApiService } from 'src/app/geo-coding-api.service';
import { EventFirebaseService } from 'src/app/event-firebase.service';
import { WallService } from 'src/app/wall.service';
import { UserFirebaseService } from 'src/app/user-firebase.service';
import { AuthService } from 'src/app/auth.service';
import { Event } from 'src/app/entity/event/event.model';
import { CreateNewEventComponent, nameValueDictionaryFromObject } from 'src/app/create-new-event/create-new-event.component';
import { GeoCoord } from 'ng2-haversine';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EventAddress } from 'src/app/entity/user/user';
import { MobileDetectorService } from 'src/app/mobile-detector.service';

export const errorMessages: { [key: string]: string } = {
  eventName: 'Titel må ikke være mere end 50 tegn',
  required: 'Dette felt er obligatorisk',
};

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  onEventCreated: EventEmitter<string> = new EventEmitter<string>();
  isMobile: boolean = false;
  histCollapsed: boolean = false;

  newEventFormGroup: FormGroup;
  apiZipValue;
  event: Event;
  geoCoord: GeoCoord;
  errors = errorMessages;
  userInsertedAddress: any;
  homeAddressSelected: boolean;
  categories: any;
  errorMessages
  user$: any;
  eventDate = new Date();
  minDate = new Date();
  maxDate = new Date();
  username;

  constructor(
    private _formBuilder: FormBuilder,
    private geoAPI: GeoCodingApiService,
    private eventService: EventFirebaseService,
    private wallService: WallService,
    private userService: UserFirebaseService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewEventComponent>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private router: Router,
    private mbs: MobileDetectorService,
  ) {
    this.user$ = this.userService.getUserByID(this.authService.afAuth.auth.currentUser.uid);
    this.user$.subscribe(userSnapshot => {
      this.username = userSnapshot.username;
    });

    this.translateService.get("COMPONENTS.NEW_EVENT.WHAT_AND_WHERE_STEP.CATEGORIES").subscribe(values => {
      this.categories = nameValueDictionaryFromObject(values);
    });

    this.errorMessages = this.translateService.instant("COMPONENTS.FORM_VALIDATION.ERROR_MESSAGES");
    this.apiZipValue = this.translateService.instant("COMPONENTS.NEW_EVENT.WHAT_AND_WHERE_STEP.CITY_LABEL");
  }

  // @ViewChild('title', {static: false}) nameInput: MatInput;

  ngOnInit() {
    this.isMobile = this.mbs.isPortrait();
    let dateNow = new Date();
    this.eventDate.setDate(dateNow.getDate() + 7);
    this.maxDate.setDate(dateNow.getDate() + 365);

    this.newEventFormGroup = this._formBuilder.group({
      eventName: ['', [Validators.required, Validators.maxLength(50)]],
      eventLocationStreet: ['', Validators.required],
      eventLocationCity: [''],
      eventLocationZip: ['', Validators.required],
      eventCategory: ['', Validators.required],
      eventDate: [this.eventDate, Validators.required],
      eventStartTime: ['18:00', Validators.required],
      eventEndTime: ['22:00', Validators.required],
    });
    //  this.nameInput.focus();
  }

  get eventName() {
    return this.newEventFormGroup.get('eventName');
  }

  onSubmitEvent() {

    if (this.newEventFormGroup.valid) {

      this.eventService.insertEvent(this.formDataToModel()).then((thenableRef: any) => {
        let key = thenableRef.path.pieces_[1];
        this.wallService.insertWall({ fk_event: key, posts: {} });
        this.onEventCreated.emit(key);
      });
      // this.userService.updateUser({numberOfEventsHosted: userSnapshot.numberOfEventsHosted + 1}, this.authService.afAuth.auth.currentUser.uid).then( () => {
      //   observer.unsubscribe();
      //   });
    } else {

      // validate all form fields
    }

    // let observer = this.ufbs.getUserByID(this.authService.afAuth.auth.currentUser.uid).subscribe( (userSnapshot:any) => {
    //   let e: Event = this.formDataToModel(userSnapshot);
    //   this.efbs.insertEvent(e).then( (thenableRef) => {
    //     let key = thenableRef.path.pieces_[1];
    //     this.ws.insertWall( {fk_event: key, posts: {} } );
    //   });
    //   this.ufbs.updateUser({numberOfEventsHosted: userSnapshot.numberOfEventsHosted + 1}, this.authService.afAuth.auth.currentUser.uid).then( () => {
    //     observer.unsubscribe();
    //     });
    //   });
  }

  formDataToModel(): Event {

    const event = new Event({});

    event.name = this.newEventFormGroup.value.eventName;
    event.address = new EventAddress(this.newEventFormGroup.value.eventLocationStreet,
      this.apiZipValue, this.newEventFormGroup.value.eventLocationZip);
    event.category = this.newEventFormGroup.value.eventCategory;
    event.dateStart = this.newEventFormGroup.value.eventDate.getTime();
    event.deadlineDate = this.newEventFormGroup.value.eventDate.getTime();
    event.timeStart = this.newEventFormGroup.value.eventStartTime;
    event.timeEnd = this.newEventFormGroup.value.eventEndTime;
    event.geoCoord = this.geoCoord;

    event.participants = [{ username: this.username }];

    event.host = this.authService.afAuth.auth.currentUser.uid;

    if (event.hostRating === undefined) {
      event.hostRating = 0;
    }

    // if (false /*!this.isTransferingMoney*/) {
    //   event.paymentDue = "Kontant ved ankomst på dagen";
    // }
    this.onNoClick();
    return event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  lookUpZipFromInput(event) {
    this.lookUpZip(event.target.value);
  }

  lookUpZip(zip) {
    if ((zip as string).length > 3) {
      this.geoAPI.getZipFromCity(zip).map(response => response.json()).subscribe(result => {
        this.geoCoord = {
          latitude: result.visueltcenter[1],
          longitude: result.visueltcenter[0]
        };
        this.apiZipValue = result.navn;
      });
    }
  }

  fillDetails(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(CreateNewEventComponent, {
      width: screen.width / 1 + "px",
      data: { event: this.formDataToModel(), stepIndex: 0 }
      // disableClose: true
    });

    dialogRef.componentInstance.onEventCreated.subscribe(resultsKey => {
      this.router.navigate(['/view-event'], { queryParams: { "key": resultsKey } })
    });
  }

  insertHomeAddress(event, user) {

    if (event.checked) {
      this.userInsertedAddress = {
        street: this.newEventFormGroup.get('eventLocationStreet').value,
        zip: this.newEventFormGroup.get('eventLocationZip').value,
        city: this.apiZipValue
      }
      this.newEventFormGroup.patchValue({
        eventLocationStreet: user.address.street,
        eventLocationZip: user.address.zip,
      });
      this.lookUpZip(user.address.zip);
    } else {
      this.newEventFormGroup.patchValue({
        eventLocationStreet: this.userInsertedAddress.street,
        eventLocationZip: this.userInsertedAddress.zip,
      });
      this.apiZipValue = this.userInsertedAddress.city;
    }
  }

  close() {

  }

}
