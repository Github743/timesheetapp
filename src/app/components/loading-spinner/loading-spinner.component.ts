import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <p-progressSpinner *ngIf="loading" styleClass="loading-panel" [animationDuration]="animationDuration"></p-progressSpinner>
  `
})
export class LoadingSpinnerComponent {
  @Input() loading: boolean = false;
  animationDuration: string = ".5s";
}
