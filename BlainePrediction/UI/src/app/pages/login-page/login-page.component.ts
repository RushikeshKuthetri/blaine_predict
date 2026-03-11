import { Component, Inject } from '@angular/core';
import { AuthenticationResult, EventMessage,EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import {  Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  imagePath:any;
  isUserLoggedin:boolean=false;
  private readonly _destroying$ = new Subject<void>();
  accessToken: any;
  loginDisplay = false;
  constructor(private authService: MsalService, private router:Router,private broadcastService: MsalBroadcastService,
              private http:HttpClient, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration) {

  }
  ngOnInit(): void {
   
    // this.imagePath={
    //   logo:'../../../assets/logo1.png',
    //   img:'../../../assets/background1.png',
    // }
    this.imagePath={
      logo:'assets/logo1.png',
      img:'assets/background1.png',
    }
   
  } 

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null;
  }

  login() {

    this.authService.loginPopup()
    .subscribe({
      next: (result) => {
        this.accessToken=result.accessToken;
        localStorage.setItem("access_token",this.accessToken)
        this.router.navigate(['/home'])
      },
      error: (error) => console.log(error)
    });
  }

  logout() {
    this.authService.logoutPopup({
        mainWindowRedirectUri: "/login"
    });
  }

  clear() {
    localStorage.clear();
   sessionStorage.clear();
   
  }

}
