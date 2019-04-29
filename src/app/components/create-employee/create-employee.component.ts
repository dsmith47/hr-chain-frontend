import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../../hr-api.service';

import { Globals } from '../../global';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  name = '';
  pubKey = '';
  supervisorPubKey = '';
  date = '';
  dollarsPerHour = '';

  lastRequestStatus = '';

  constructor(private api: HrApiService) { }

  ngOnInit() {
  }

  createEmployee() {
    this.api.createEmployee(this.pubKey, this.name, this.pubKey, this.supervisorPubKey, this.dollarsPerHour ).subscribe((data) => {
        console.log(data);
    });
  }
}
