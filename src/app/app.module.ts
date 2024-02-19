import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMenuItemComponent } from './app.menuitem.component';
import { AppMainComponent } from './app.main.component';
import { AppMenuComponent } from './app.menu.component';
import { SidebarComponent } from './_layout/sidebar/sidebar.component';
import { MenuService } from './service/app.menu.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmployeetimesheetComponent } from './employeetimesheet/employeetimesheet.component';
import { MonthPickerComponent } from './components/month-picker/month-picker.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { PrimeTableComponent } from './components/prime-table/prime-table.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMenuItemComponent,
    SidebarComponent,
    AppMainComponent,
    AppMenuComponent,
    LoadingSpinnerComponent,
    EmployeetimesheetComponent,
    MonthPickerComponent,
    PrimeTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputTextModule,
    CalendarModule,
    ListboxModule,
    CheckboxModule,
    DropdownModule,
    TableModule,
    InputNumberModule,
    ToastModule,
    TooltipModule,
    ToolbarModule,
    MenubarModule,
    ProgressBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    DialogModule,
    DynamicDialogModule,
    InputSwitchModule,
    SplitButtonModule,
    MenuModule
  ],
  providers: [
    DatePipe,
    MenuService,
    MessageService,
    DialogService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
