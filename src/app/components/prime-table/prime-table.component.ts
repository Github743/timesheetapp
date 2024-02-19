import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-prime-table',
    templateUrl: './prime-table.component.html',
    styleUrls: ['./prime-table.component.scss']
})
export class PrimeTableComponent implements OnInit {

    @Input()
    data: any[] = [];
    @Input()
    globalFilters: any[] = [];
    @Input()
    columns: any[] = [];
    @Input()
    displayFilter: boolean = true;

    @Input()
    customBodyTemplate!: TemplateRef<any>;
    @Input()
    showInput: boolean = true;

    deleteEmployee: boolean = false;

    constructor() { }
    ngOnInit() {

    }
}
