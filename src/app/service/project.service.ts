import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class ProjectService {

    constructor(private http: HttpClient) { }

    getProjects(): Promise<Project[]> {
        return this.http.get<Project[]>('assets/demo/data/projects.json')
            .pipe(
                catchError(error => {
                    console.error('Error fetching projects:', error);
                    return of([] as Project[]); // Return an empty array as Project[]
                })
            )
            .toPromise() as Promise<Project[]>; // Explicitly cast to Promise<Project[]>
    }
}
