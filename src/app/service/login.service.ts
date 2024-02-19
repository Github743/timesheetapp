import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { LoginModel } from '../model/login.model';
import { updatePasswordModel } from '../model/updatepassword.model';
import { ConfigService } from './ConfigService';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  login(model: LoginModel): Observable<any> {
    return this.configService.getBaseUrl().pipe(
      switchMap((baseUrl: string) => {
        const url = `${baseUrl}/SignIn`;
        return this.http.post<any>(url, model);
      })
    );
  }

  updatePassword(updatepasswordmodel: updatePasswordModel): Observable<any>{
    return this.configService.getBaseUrl().pipe(
      switchMap((baseUrl: string) => {
        const url = `${baseUrl}/ChangePassword`;
        return this.http.post<any>(url, updatepasswordmodel);
      })
    );
  }
}

