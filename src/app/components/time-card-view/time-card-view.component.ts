import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../../hr-api.service';

@Component({
  selector: 'app-time-card-view',
  templateUrl: './time-card-view.component.html',
  styleUrls: ['./time-card-view.component.css']
})
export class TimeCardViewComponent implements OnInit {

  empName = '';
  empId = '';
  empKey = '';
  supKey = '';

  assetId = '';
  pubKey = '';
  date = '';
  project = '';
  minutes_worked = '';

  lastRequestStatus = '';

  employeeTimeCards = [];

  constructor(private api: HrApiService) { }

  ngOnInit() {
    this.getEmployeeInformation();
    this.getEmployeeTimeCards();
  }

  getAllTickets() {
    this.api.modifyProjectTime(this.assetId, this.pubKey, this.date, this.minutes_worked)
      .subscribe((data) => {
        console.log(data);
        this.lastRequestStatus = 'submission Logged!';
        this.getEmployeeInformation();
      });
  }

  getEmployeeInformation() {
    this.api.getEmployee('0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55')
    .subscribe(((data) => {
      const d = JSON.parse(data._body).results[0].payload.inputs;

     this.empName = d['name'];
     this.empId = d['assetId'];
     this.empKey = d['public_key'];
     this.supKey = d['supervisor'];
    }));
  }

  getEmployeeTimeCards() {
    this.api.getEmployeeTimeCards('0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55')
      .subscribe((data) => {
        console.log(data);

        const d = JSON.parse(data._body);
        console.log(d);

        this.employeeTimeCards = d.results;
      });
  }

}
