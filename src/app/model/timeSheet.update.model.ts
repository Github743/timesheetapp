import { TimeSheet } from "./timesheet.model";

export interface TimeSheetUpdateModel {
    TimeSheets: TimeSheet[];
    employeeId: string;
    employeeName: string;
    employeeEmailId: string;
    month: number
    year: number;
}
