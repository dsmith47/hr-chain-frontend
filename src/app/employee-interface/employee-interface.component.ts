import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../hr-api.service';

@Component({
  selector: 'app-employee-interface',
  templateUrl: './employee-interface.component.html',
  styleUrls: ['./employee-interface.component.css']
})
export class EmployeeInterfaceComponent implements OnInit {

  constructor(private api: HrApiService) { }

  ngOnInit() {
  }

  getAllTickets() {
    console.log("Getting All Tickets");
    console.log(this.api.getTicketIds());
  }

}
