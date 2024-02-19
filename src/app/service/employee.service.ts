import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ConfigService } from './ConfigService';
import { EmployeeModel } from '../model/employee.model';
@Injectable({
    providedIn: 'root'
})

export class EmployeeService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    setEmployeeRole(employeeId: string, role: string): Observable<any> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/Employee/${employeeId}/Role/${role}`;
                return this.http.post<any>(url, null);
            })
        );
    }

    addUpdateEmployee(model: EmployeeModel): Observable<any> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/Employee`;
                return this.http.post<any>(url, model);
            })
        );
    }

    getAll(): Observable<any[]> {
        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/Employee`;
                return this.http.get<any[]>(url);
            })
        );
    }

    makeEmployeeInactive(emailId: string, exitDate: Date) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.configService.getBaseUrl().pipe(
            switchMap((baseUrl: string) => {
                const url = `${baseUrl}/Employee/Inactive`;
                const dataToSend = JSON.stringify(emailId);
                return this.http.post<any>(url, dataToSend, {
                    headers: headers,
                    params: { exitDate: exitDate.toISOString() }
                });
            })
        );
    }

}
