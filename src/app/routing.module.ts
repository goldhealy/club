import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DummyListComponent} from './dummy-list/dummy-list.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { LoggedinDashboardComponent } from './loggedin-dashboard/loggedin-dashboard.component';
import { EventsComponent } from './events/events.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CreateNewEventComponent } from './create-new-event/create-new-event.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FeedbackComponent } from './feedback/feedback.component';


const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'loggedin-dashboard', component: LoggedinDashboardComponent },
  { path: 'events', component: EventsComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'create-new-event', component: CreateNewEventComponent },
  { path: 'about', component: AboutComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'dummy-list',
    component: DummyListComponent,
    data: { title: 'Dummy List' }
  },
  { path: '',
    redirectTo: '/landing-page',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}