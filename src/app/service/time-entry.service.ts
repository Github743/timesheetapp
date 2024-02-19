import { Injectable } from '@angular/core';
import { TimeSheetUpdateModel } from '../model/timeSheet.update.model';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ConfigService } from './ConfigService';

@Injectable({
    providedIn: 'root',
})
export class TimeSheetService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    addEmployeeTimeSheet(model: TimeSheetUpdateModel): Observable<any> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/TimeSheet`;
                return this.http.post<any>(url, model);
            })
        );
    }

    getTimesheetData(employeeId: string, month: number, year: number): Observable<any[]> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/TimeSheet?eid=${employeeId}&m=${month}&y=${year}`;
                return this.http.get<any>(url);
            })
        );
    }
}
