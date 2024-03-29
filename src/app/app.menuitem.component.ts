import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './service/app.menu.service';
import { AppMainComponent } from './app.main.component';


@Component({
    /* tslint:disable:component-selector */
    selector: '[app-menuitem]',
    /* tslint:enable:component-selector */
    template: `
          <ng-container>
              <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">{{item.label}}</div>
              <a [attr.href]="item.url" (click)="itemClick($event)" *ngIf="(!item.routerLink || item.items) && item.visible !== false"
                 (mouseenter)="onMouseEnter()" (keydown.enter)="itemClick($event)"
                 [attr.target]="item.target" [attr.tabindex]="0" [ngClass]="item.class" pRipple>
                  <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                  <span>{{item.label}}</span>
				  <span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
                  <i class="pi pi-fw pi-angle-down layout-menuitem-toggler" *ngIf="item.items"></i>
              </a>
              <a (click)="itemClick($event)" (mouseenter)="onMouseEnter()" *ngIf="(item.routerLink && !item.items) && item.visible !== false"
                  [routerLink]="item.routerLink" routerLinkActive="active-menuitem-routerlink"
                  [routerLinkActiveOptions]="{exact: !item.preventExact}" [attr.target]="item.target" [attr.tabindex]="0" [ngClass]="item.class" pRipple>
                  <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				  <span>{{item.label}}</span>
				  <span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
				  <i class="pi pi-fw pi-angle-down layout-menuitem-toggler" *ngIf="item.items"></i>
              </a>
			  <div class="layout-menu-tooltip" *ngIf="item.visible !== false">
				  <div class="layout-menu-tooltip-arrow"></div>
				  <div class="layout-menu-tooltip-text">{{item.label}}</div>
			  </div>
              <ul *ngIf="(item.items || (active || animating)) && item.visible !== false" (@children.done)="onAnimationDone()"
                  [@children]="(app.slimMenu && root && !app.isMobile()) ? (active ? 'visible' : 'hidden') :
                  (root ? 'visible' : active ? 'visibleAnimated' : 'hiddenAnimated')">
                  <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                      <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
                  </ng-template>
              </ul>
          </ng-container>
      `,
    host: {
        '[class.layout-root-menuitem]': 'root',
        '[class.active-menuitem]': 'active'
    },
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px'
            })),
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuItemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index!: number;

    @Input() root!: boolean;

    @Input() parentKey!: string;

    animating: boolean = false;

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = '';

    constructor(public app: AppMainComponent, public router: Router, private cd: ChangeDetectorRef, private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
            // deactivate current active menu
            if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
                this.active = false;
            }
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.app.slimMenu) {
                    this.active = false;
                } else {
                    if (this.item.routerLink) {
                        this.updateActiveStateFromRoute();
                    } else {
                        this.active = false;
                    }
                }
            });
    }

    ngOnInit() {
        if (!this.app.slimMenu && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }

        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
    }

    updateActiveStateFromRoute() {
        this.active = this.router.isActive(this.item.routerLink[0], !this.item.items && !this.item.preventExact);
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover in horizontal mode
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        // notify other items
        this.menuService.onMenuStateChange(this.key);

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
            this.animating = true;
        } else {
            // activate item
            this.active = true;

            // hide overlay menus
            if (this.app.overlayMenu || this.app.isMobile()) {
                this.app.overlayMenuActive = false;
                this.app.mobileMenuActive = false;
            }

            // reset horizontal menu
            if (this.app.slimMenu) {
                this.menuService.reset();
            }

            this.app.menuHoverActive = !this.app.menuHoverActive;
            const targetElement = event.currentTarget as Element;

            const ink = this.getInk(targetElement);
            if (ink) {
                this.removeClass(ink, 'p-ink-active');
            }
        }
    }

    getInk(el: Element): HTMLElement | null {
        if (el instanceof HTMLElement) {
            // Access properties specific to HTMLElement if needed
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < el.children.length; i++) {
            if (typeof el.children[i].className === 'string' && el.children[i].className.indexOf('p-ink') !== -1) {
                return el.children[i] as HTMLElement;
            }
        }
        return null;
    }


    removeClass(element: HTMLElement, className: string) {
        if (element.classList) {
            element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && this.app.menuHoverActive && this.app.slimMenu && !this.app.isMobile()) {
            this.menuService.onMenuStateChange(this.key);
            this.active = true;
        }
    }

    onAnimationDone() {
        this.animating = false;
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
