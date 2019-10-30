import { GeoCoord } from 'ng2-haversine';
import { EventAddress } from '../user/user';

// eventQueue: ['no', Validators.required]
// });
// this.thirdFormGroup = this._formBuilder.group({
// eventDate: [this.eventDate, Validators.required],
// eventStartTime: ['13:59', Validators.required],
// eventEndTime: ['14:53', Validators.required],
// eventDeadlineDate: [this.maxRegistrationDate, Validators.required],
// eventDeadlineTime: ['00:00', Validators.required]


export function setDateFromNow(daysFromNow) {
  let date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toString();
}

export class Event {
    key: string;
    name: string;
    description: string = '';
    dateStart: any; // = setDateFromNow(7);
    timeStart: number;
    timeEnd: number;
    category: string;
    targetGroup: string = 'any';
    minAge: number = 18;
    maxAge: number = 100;
    file: File;
    hostRating: number;
    minGuests: number = 2;
    maxGuests: number = 8;
    genderRatio: string = 'any';
    geoCoord: GeoCoord;
    queue: boolean;
    inQueue: {};
    address: EventAddress;
    deadlineDate: any;//string = setDateFromNow(4);
    deadlineTime: number;
    price: number;
    paymentOption: string;
    paymentDue: string;
    paymentDate: any;//string;
    participants: {};
    host: string;
    accountNumber: number;
    mobilePayNumber: number;
    timestamp: string;
    distance: string;
    creationDate: any;//string = setDateFromNow(0);
    published: boolean = false;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

}
