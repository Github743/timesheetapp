import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { EmployeetimesheetComponent } from './employeetimesheet/employeetimesheet.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: AppMainComponent,
        children: [
          { path: 'mytimesheet', component: EmployeetimesheetComponent },
        ]
      }
    ], { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
