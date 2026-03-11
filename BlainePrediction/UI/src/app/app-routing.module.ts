import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MicrosoftLoginGuard } from './ms-login';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { GaugeComponents } from './graphs/gauge/gauge.component';
import { BarGraphComponent } from './graphs/bar-graph/bar-graph.component';
import { MsalGuard } from '@azure/msal-angular';
import { LineChartComponent } from './graphs/line-chart/line-chart.component';
import { DatetimepickerComponent } from './common/datetimepicker/datetimepicker.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: '/login',
  },

  {
    path:'login',
    component:LoginPageComponent
  },
  {
    path:'line',
    component:DatetimepickerComponent
  },    

  {
    path:'home',
    component: MainLayoutComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

// 

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
