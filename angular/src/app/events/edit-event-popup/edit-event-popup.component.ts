import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CreateNewEventComponent } from 'src/app/create-new-event/create-new-event.component';

@Component({
  selector: 'app-edit-event-popup',
  templateUrl: './edit-event-popup.component.html',
  styleUrls: ['./edit-event-popup.component.css']
})
export class EditEventPopupComponent implements OnInit {

  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<EditEventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  edit() {
    this.dialog.open(CreateNewEventComponent, {
      width: screen.width / 1.25 + "px",
      data: {event: this.data.event, stepIndex: 0, eventKey: this.data.eventKey}
    });
    this.dialogRef.close();
  }
}
