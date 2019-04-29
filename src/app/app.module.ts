import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { HrApiService } from './hr-api.service';
import { Globals } from './global';

import { AppComponent } from './app.component';
import { EmployeeInterfaceComponent } from './components/employee-interface/employee-interface.component';
import { AuthComponent } from './components/auth/auth.component';
import { TimeCardViewComponent } from './components/time-card-view/time-card-view.component';
import { ModifyTimecardComponent } from './components/modify-timecard/modify-timecard.component';
import { CreateTimecardComponent } from './components/create-timecard/create-timecard.component';
import { SupvInterfaceComponent } from './components/supv-interface/supv-interface.component';
import { SubmitTimecardComponent } from './components/submit-timecard/submit-timecard.component';

const routes: Routes = [
  {path: '', component: AuthComponent},
  {path: 'employee-interface', component: EmployeeInterfaceComponent},
  {path: 'time-card-view', component: TimeCardViewComponent},
  {path: 'supervisor', component: SupvInterfaceComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    EmployeeInterfaceComponent,
    AuthComponent,
    TimeCardViewComponent,
    ModifyTimecardComponent,
    CreateTimecardComponent,
    SupvInterfaceComponent,
    SubmitTimecardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    HrApiService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
