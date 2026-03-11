import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent} from './app.component';
import { GaugeComponents} from './graphs/gauge/gauge.component';
import { MSAL_INSTANCE, MsalCustomNavigationClient, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomeComponent } from './pages/home/home.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { LoaderComponent } from './common/loader/loader.component';
import { BarGraphComponent } from './graphs/bar-graph/bar-graph.component';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from './services/socket.service';
import { blainModel } from './pages/home/blainModel.model';
import { LineChartComponent } from './graphs/line-chart/line-chart.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import {
//   FaIconLibrary,
//   FontAwesomeModule
// } from "@fortawesome/angular-fontawesome";
// import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { DatetimepickerComponent } from './common/datetimepicker/datetimepicker.component';
import { environment } from '../environments/environment';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './common/header/header.component';
import { SidebrComponent } from './common/sidebr/sidebr.component';
import { FooterComponent } from './common/footer/footer.component';

// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: 'd99c09ff-0cf2-44fc-a605-6a769e0c0d6f',
//       // redirectUri: "https://utcmfgiiotlinxui001-testing.azurewebsites.net",
//       redirectUri: 'https://utcmfgiiotlinxui001-opt.azurewebsites.net/',
//       authority:"https://login.microsoftonline.com/f87a5f5e-f97e-4aec-bab8-6e4187ef4f1c",
     

//     },
//     cache: {

//       cacheLocation: "localStorage", // This configures where your cache will be stored
//       storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
//      },
     
//   })
//   ;
// }
@NgModule({
  declarations: [
     HeaderComponent,
     SidebrComponent,
      FooterComponent,
     MainLayoutComponent,
    AppComponent,
    GaugeComponents,
    LoginPageComponent,
    HomeComponent,
    LoaderComponent,
    BarGraphComponent,
    LineChartComponent,
    DatetimepickerComponent
  ],
  imports: [
   
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    TimepickerModule.forRoot(),
    ModalModule.forRoot(),
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 15000, // 15 seconds   
      progressBar: true,
    }),
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: 'd99c09ff-0cf2-44fc-a605-6a769e0c0d6f',
          // redirectUri: "https://utcmfgiiotlinxui001-testing.azurewebsites.net",
          // redirectUri:'http://localhost:4200',
          // redirectUri: 'https://utcmfgiiotlinxui001-opt.azurewebsites.net/',
          // redirectUri:'https://i4.utclconnect.com/',
          // redirectUri:'https://dev.d24ohd8z0zwg7d.amplifyapp.com/', //dev
          redirectUri: environment.redirectUri,
          // redirectUri:'https://uat.d2m46todvn5tvi.amplifyapp.com/', //uat
          authority:"https://login.microsoftonline.com/f87a5f5e-f97e-4aec-bab8-6e4187ef4f1c",
        },
        cache: {
          cacheLocation: "localStorage", // This configures where your cache will be stored
          storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
      }),
      {
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: ["user.read"],
        },
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
      }
    ),
    
  ],
  providers: [
    MsalService,
    SocketService,
    blainModel,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },MsalGuard
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [GaugeComponents],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
  // constructor(library: FaIconLibrary) {
  //   library.addIcons(faCalendar, faClock);
  // }
 }
     