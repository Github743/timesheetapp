import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppComponent } from './app.component';
import { MenuService } from './service/app.menu.service';

@Component({
    selector: 'main',
    templateUrl: './app.main.component.html'
})

export class AppMainComponent {

    staticMenuInactive: boolean = false;

    overlayMenuActive: boolean = false;

    mobileMenuActive: boolean = false;

    menuClick: boolean = false;

    menuButtonClick: boolean = false;

    topbarMenuButtonClick: boolean = false;

    topbarMenuActive: boolean = false;

    activeTopbarItem: Element | null = null;

    menuHoverActive: boolean = false;

    configActive: boolean = false;

    configClick: boolean = false;

    constructor(private menuService: MenuService, private primengConfig: PrimeNGConfig, public app: AppComponent) {
    }

    onLayoutClick() {
        if (!this.menuClick && !this.menuButtonClick) {
            if (this.slimMenu) {
                this.menuService.reset();
            }

            this.mobileMenuActive = false;
            this.overlayMenuActive = false;
            this.menuHoverActive = false;
        }

        if (!this.topbarMenuButtonClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.configClick = false;
        this.menuClick = false;
        this.menuButtonClick = false;
        this.topbarMenuButtonClick = false;

    }

    get slimMenu(): boolean {
        return this.app.menu === 'slim';
    }

    get overlayMenu(): boolean {
        return this.app.menu === 'overlay';
    }

    get staticMenu(): boolean {
        return this.app.menu === 'static';
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    onMenuClick(event: Event) {
        this.menuClick = true;
    }

    onTopbarSubItemClick(event: Event) {
        console.log(event);
        event.preventDefault();
    }

    onMenuButtonClick(event: Event) {
        this.menuButtonClick = true;

        if (this.isMobile()) {
            this.mobileMenuActive = !this.mobileMenuActive;
        } else {
            if (this.staticMenu) {
                this.staticMenuInactive = !this.staticMenuInactive;
            } else if (this.overlayMenu) {
                this.overlayMenuActive = !this.overlayMenuActive;
            }
        }

        event.preventDefault();
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarMenuButtonClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;
        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item: Element) {
        this.topbarMenuButtonClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

}