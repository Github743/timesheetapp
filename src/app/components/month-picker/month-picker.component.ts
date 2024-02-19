// calendar.component.ts

import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-calendar',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent {
  selectedMonth!: Date;
  dateTime = new Date();
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  constructor() { }

  ngOnInit(): void {
  }

  updateDaysInMonth(event: any) {
    this.selectedMonth = event;
    this.dateChanged.emit(this.selectedMonth);
  }
}
