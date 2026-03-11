import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  logoPath!: string;

  constructor(private authService: MsalService){}

  ngOnInit(){
    this.logoPath='assets/logo.png';
  }

  logout(){
    // console.log("logout");
    
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/login"
  });
  localStorage.clear()
  sessionStorage.clear()
  }
}
