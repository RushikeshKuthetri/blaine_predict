import { MsalService } from '@azure/msal-angular';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftLoginGuard implements CanActivate {

  constructor(private authService: MsalService,private router:Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
console.log(this.authService.instance.getActiveAccount())
    if (this.authService.instance.getActiveAccount() == null) {
      console.log('not logged in!')
      // this.router.navigate(['login'])
      return false;
    }
    // this.router.navigate(['home'])
    return true;
  }

}