import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../../hr-api.service';

import { Globals } from '../../global';

@Component({
  selector: 'app-create-timecard',
  templateUrl: './create-timecard.component.html',
  styleUrls: ['./create-timecard.component.css']
})
export class CreateTimecardComponent implements OnInit {

  empName = '';
  empId = '';
  empKey = '';
  supKey = '';

  assetId = '';
  pubKey = '';
  date = '';
  minutes_worked = '';

  lastRequestStatus = '';

  constructor(private api: HrApiService) { }

  ngOnInit() {
    this.getEmployeeInformation();
    console.log(this.api);
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

  createTimecard() {
    this.api.createTimecard(Globals.pubKey, "01/01/2019", Globals.pubKey).subscribe((data) => {
      console.log(data);
    });
  }
}
