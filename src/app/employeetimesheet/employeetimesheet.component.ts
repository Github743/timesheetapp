import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { TimeSheetService } from '../service/time-entry.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';
import { TimeSheetUpdateModel } from '../model/timeSheet.update.model';
import { MessageService } from 'primeng/api';
import { isWeekend } from '../common/helper';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employeetimesheet',
  templateUrl: './employeetimesheet.component.html',
  styleUrl: './employeetimesheet.component.scss'
})
export class EmployeetimesheetComponent implements OnInit {

  timesheetform!: FormGroup;
  defaultHrs: boolean = false;
  totalMissingDays: number = 0;
  excWeekEnd: boolean = false;
  isLoading: boolean = false;
  selectedDate!: Date;
  totalSubmittedHrs: number = 0;
  dialogVisible: boolean = false;


  // employeeShift: any[] = [
  //   { name: '6 AM - 3 PM', code: '6 AM - 3 PM' },
  //   { name: '2 PM - 11 PM', code: '2 PM - 11 PM' },
  //   { name: '6 PM - 3 AM', code: '6 PM - 3 AM' }
  // ];
  employeeShift: any[] = ['6 AM - 3 PM', '2 PM - 11 PM', '6 PM - 3 AM'];

  monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


  updateModel: TimeSheetUpdateModel = {
    TimeSheets: [],
    employeeId: '',
    employeeName: '',
    employeeEmailId: '',
    month: 0,
    year: 0
  };

  constructor(private fb: FormBuilder, private messageService: MessageService, private timeSheetService: TimeSheetService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.timesheetform = this.fb.group({
      month: [''],
      updateProj: '',
      updateTask: '',
      upDateshift: new FormControl<any | null>(null),
      timeSheetControls: this.fb.array([])
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const monthIndex = date.getMonth();
    const month = this.monthShortNames[monthIndex];
    const year = date.getFullYear();
    const dayOfWeekIndex = date.getDay();
    const dayOfWeek = this.daysOfWeek[dayOfWeekIndex];
    return `${day}/${month}/${year} (${dayOfWeek})`;
  }

  createTimeSheetFormGroup(date: Date, shift: string, project: string, task: string, hours: number, remarks: string, client: string) {
    return this.fb.group({
      date: [date],
      shift: [shift],
      project: [project],
      task: [task],
      hours: [hours],
      remarks: [remarks],
      client: [client]
    });
  }


  get timeSheetControls() {
    return this.timesheetform.get('timeSheetControls') as FormArray;
  }

  updateDaysInMonth(date: Date) {
    const currentDate = new Date();
    this.selectedDate = date;
    this.isLoading = true;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    this.timeSheetControls.clear();

    for (let i = 0; i < lastDay; i++) {
      const day = i + 1;
      const currentDate = new Date(year, month - 1, day);
      this.timeSheetControls.push(this.createTimeSheetFormGroup(currentDate, '', '', '', 0, '', ''));
    }

    this.totalMissingDays = 0;
    this.timeSheetControls.controls.forEach((control: AbstractControl) => {
      const remarks = control.value.remarks;
      const controlDate = new Date(control.value.date);
      if (controlDate < currentDate && !['H', 'L', 'W'].includes(remarks) && control.value.hours === 0) {
        const missingCnt = 1;
        this.totalMissingDays += missingCnt;
      }
      if (controlDate > currentDate) {
        control.disable();
      }
      this.isLoading = false;
    });
  }

  onExludeWeekEnd(event: CheckboxChangeEvent) {
    if (event.checked.length > 0) {
      this.excWeekEnd = true;
      this.fillHrs();
    } else {
      this.excWeekEnd = false;
      this.fillHrs();
    }
  }

  fillDefaultHrs(event: CheckboxChangeEvent) {
    if (event.checked.length > 0) {
      this.defaultHrs = true;
      this.fillHrs();
    } else {
      this.defaultHrs = false;
      this.fillHrs();
    }
  }

  fillHrs() {
    const currentDate = new Date();
    this.timeSheetControls.controls.forEach((control: AbstractControl) => {
      if (isWeekend(control.value.date) && this.excWeekEnd) {
        control.patchValue({
          hours: 0,
          remarks: "W"
        });
      }
      else {
        const controlDate = new Date(control.value.date);
        if (controlDate > currentDate) {
          control.disable();
        }
        else {
          control.patchValue({
            hours: this.defaultHrs ? 8 : 0,
            remarks: ''
          });
        }
      }
      // control.patchValue({
      //   hours: this.defaultHrs ? 8 : 0
      // });
    });
  }

  submitTimeSheet() {
    this.isLoading = true;
    this.updateModel.employeeEmailId = this.cookieService.get("emailId");
    this.updateModel.employeeId = this.cookieService.get("employeeId");
    this.updateModel.employeeName = this.cookieService.get("employeeName");
    this.updateModel.TimeSheets = [];
    this.updateModel.month = this.selectedDate.getMonth() + 1;
    this.updateModel.year = this.selectedDate.getFullYear();
    this.timeSheetControls.controls.forEach((control: AbstractControl) => {
      let timeSheetEntry: any;
      timeSheetEntry = {
        project: control.value.project,
        task: control.value.task,
        hours: control.value.hours,
        shift: control.value.shift,
        remarks: control.value.remarks,
        client: control.value.client,
        date: control.value.date.getFullYear().toString() + "-" + (control.value.date.getMonth() + 1).toString().padStart(2, '0') + "-" + control.value.date.getDate().toString().padStart(2, '0'),
      };
      this.updateModel.TimeSheets.push(timeSheetEntry);
    });

    this.timeSheetService.addEmployeeTimeSheet(this.updateModel)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while submitting timesheet' });
          return throwError(() => error);
        })
      )
      .subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'timesheet submitted' });
          this.isLoading = false;
          this.updateDaysInMonth(this.selectedDate);
        }
      );
  }

  exportToExcel(): void {
    const data = this.timeSheetControls.value; // Replace with your actual data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'timesheet');
  }

  // Helper function to save the Excel file
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}_${new Date().getTime()}.xlsx`;
    link.click();
  }

  showDialog() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  updateTask() {
    const currentDate = new Date();
    this.timeSheetControls.controls.forEach((control: AbstractControl) => {
      const controlDate = new Date(control.value.date);
      if (controlDate < currentDate) {
        control.patchValue({
          project: isWeekend(control.value.date) && this.excWeekEnd ? "" : this.timesheetform.get('updateProj')?.value,
          task: isWeekend(control.value.date) && this.excWeekEnd ? "" : this.timesheetform.get('updateTask')?.value,
          shift: isWeekend(control.value.date) && this.excWeekEnd ? "" : this.timesheetform.get('upDateshift')?.value,
          remarks: isWeekend(control.value.date) && this.excWeekEnd ? "W" : ""
        });

      }
    })
    const updateProj = this.timesheetform.get("updateProj");
    const updateTask = this.timesheetform.get("updateTask");
    const upDateshift = this.timesheetform.get("upDateshift");

    updateProj?.setValue('');
    updateTask?.setValue('');
    upDateshift?.setValue('');

    this.dialogVisible = false;
  }
}
