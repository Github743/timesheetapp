import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private cookieService: CookieService, public app: AppComponent, public appMain: AppMainComponent) { }

    ngOnInit() {
        const isAdmin = this.cookieService.get("employeeRole") == "admin" ? true : false;
        this.model = [
            {
                items: [
                    { label: 'My Timesheet', icon: 'pi pi-fw pi-clock', routerLink: ['/mytimesheet'] }
                ]
            },
        ];
    }
}
