import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MobileLoginHeaderComponent } from '../mobile-login-header/mobile-login-header.component';
import { MobileDetectorService } from '../mobile-detector.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFirebaseService } from '../user-firebase.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'landing-page-header',
  templateUrl: './landing-page-header.component.html',
  styleUrls: ['./landing-page-header.component.css']
})
export class LandingPageHeaderComponent implements OnInit {

  isMobile = false;
  hide: true;
  isLoggedOut = false;
  username: string;
  singUpVisible: boolean = true;

  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private mds: MobileDetectorService,
    private spinner: NgxSpinnerService,
    private ufbs: UserFirebaseService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {

    this.singUpVisible = this.router.url !== '/sign-up';

    this.isMobile = this.mds.check();
    this.authService.afAuth.auth.onAuthStateChanged(user => {
      if (user !== null && user.emailVerified && 
        (this.router.url === '/landing-page' || this.router.url === '/')) {
        // this.router.navigate(['/events']);
      } else {
        this.isLoggedOut = true;
      }
      //   else if (user && !user.emailVerified) {
      //     this.toastr.warning("Det lader til at du har et login, men ikke har bekræftet din email. Dette skal gøres inden 24 timer.", 'ℹ️ ')
      //   }
    });
  }

  tryLogin(formData) {
    this.spinner.show();
    this.authService.doLogin(formData).then(() => {
      this.spinner.hide();
    }).catch(() => {
      this.spinner.hide();
    });
  }

  tryFacebookLogin() {
    this.spinner.show();
    this.authService.doFacebookLogin().then((callback) => {
      this.spinner.hide();
    }).catch((error) => {
      this.spinner.hide();
    });
  }

  tryGoogleLogin() {
    this.spinner.show();
    this.authService.doGoogleLogin().then(() => {
      this.spinner.hide();
    }).catch(() => {
      this.spinner.hide();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MobileLoginHeaderComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  showSuccess(msg = "", status = "") {
    this.toastr.clear();
    this.toastr.success(msg, status);
  }

  translateCallback(message: string) {
    if (message.includes('An account already exists')) {
      return "En konto findes allerede oprettet med den samme email addresse. Dette skyldes at du allerede har en Google konto eller Facebook konto tilknyttet SingleNetværket. Log derfor ind med den anden.";
    }
  }

}

