import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HrApiService } from './hr-api.service';

import { AppComponent } from './app.component';
import { EmployeeInterfaceComponent } from './employee-interface/employee-interface.component';
import { TimeCardViewComponent } from './time-card-view/time-card-view.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeInterfaceComponent,
    TimeCardViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    HrApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
