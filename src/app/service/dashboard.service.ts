import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ConfigService } from './ConfigService';
@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    getTimesheetDataByEmployee(employeeId: string): Observable<any[]> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/TimeSheet?eid=${employeeId}`;
                return this.http.get<any[]>(url);
            })
        );
    }
}
