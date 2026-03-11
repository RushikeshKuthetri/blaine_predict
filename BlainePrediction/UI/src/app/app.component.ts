import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationResult, EventMessage,EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})




export class AppComponent{
  title = 'blain-prediction';
  private readonly _destroying$ = new Subject<void>();
  constructor(private router:Router,private broadcastService: MsalBroadcastService){
    // if(sessionStorage.getItem("IsLoggedIn")=='true'){
    //   this.router.navigate(['/home'])
    // }
    // else{
    //   this.router.navigate(['/login'])
    // }
  }


}
