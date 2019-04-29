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
  minutes_worked = '';

  lastRequestStatus = '';

  constructor(private api: HrApiService) { }

  ngOnInit() {
    this.getEmployeeInformation();
  }

  getTimeCards() {
    const time_cards = [];

    const time_cards_dict = this.api.getTimeCardsForEmployee(this.empKey);

    for (const date in time_cards_dict) {
      const time_card = time_cards_dict[date];
      const row = [time_card.date, time_card.minutes_worked, time_card.status];
      time_cards.push(row);
    }

    return time_cards;
  }

  getEmployeeInformation() {
    this.api.getEmployee('0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55')
    .subscribe((data) => {
      const d = JSON.parse(data._body).results[0].payload.inputs;

     this.empName = d['name'];
     this.empId = d['assetId'];
     this.empKey = d['public_key'];
     this.supKey = d['supervisor'];
    });
  }
}

