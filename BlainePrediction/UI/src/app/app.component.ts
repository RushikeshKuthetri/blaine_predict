import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  title = 'blain-prediction';
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private broadcastService: MsalBroadcastService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.init();
  }

  ngAfterViewInit(): void {}

}