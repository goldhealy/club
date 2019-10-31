import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEventComponent } from './new-event/new-event.component';
import { EventsComponent } from './events.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventFilterComponent } from './event-filter/event-filter.component';
import { EventControlMenuComponent } from './event-control-menu/event-control-menu.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule, 
         MatTableModule, 
         MatPaginatorModule, 
         MatOptionModule, 
         MatSelectModule, 
         MatSliderModule, 
         MatCardModule,
         MatInputModule, 
         MatButtonModule, 
         MatGridListModule, 
         MatCheckboxModule, 
         MatTooltipModule,
         MatDatepickerModule,
         MatSortModule,
         MatIconModule,
         MatChipsModule,
         MatListModule,
         MatTabsModule,
         MatDialogModule
        } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LibModule } from '../lib/lib.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ViewEventComponent } from './view-event/view-event.component';
import { RouterModule } from '@angular/router';
import { EditEventPopupComponent } from './edit-event-popup/edit-event-popup.component';


@NgModule({
  declarations: [
    EventsComponent,
    NewEventComponent,
    EventListComponent,
    EventFilterComponent,
    EventControlMenuComponent,
    ViewEventComponent,
    EditEventPopupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LibModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    AngularFontAwesomeModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    EventsComponent,
  ],
  entryComponents: [
    NewEventComponent,
    EditEventPopupComponent,
  ]
})
export class EventsModule { }
