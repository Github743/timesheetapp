import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private configUrl = 'assets/config/config.json'; // Path to configuration file

    constructor(private http: HttpClient) { }

    getConfig(): Observable<any> {
        return this.http.get(this.configUrl);
    }

    getBaseUrl(): Observable<string> {
        return this.getConfig().pipe(
            map((config: any) => {
                const environment = config.environment.isLocal ? 'local' : 'dev';
                return config[environment].baseUrl;
            })
        );
    }

}
