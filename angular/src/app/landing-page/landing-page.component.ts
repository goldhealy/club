import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { UserFirebaseService } from '../user-firebase.service';
import { MobileDetectorService } from '../mobile-detector.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  isMobile: boolean = false;

  constructor(private spinner: NgxSpinnerService,
    private authService: AuthService,
    private ufbs: UserFirebaseService,
    private mds: MobileDetectorService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnChanges() {

  }

  ngOnInit() {
    this.isMobile = this.mds.check();

    this.authService.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        if (user.emailVerified) {
          this.router.navigate(['/events']);
        } else {
          this.toast.warning("Det lader til at du har et login, men ikke har bekræftet din email. Dette skal gøres inden 24 timer.", 'ℹ️ ')
        }
      }
    });
  }

  onLoading() {
    this.spinner.show();
  }

  onLoaded() {
    this.spinner.hide();
  }

}
