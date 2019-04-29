import { Component, OnInit } from '@angular/core';
import { HrApiService } from '../../hr-api.service';

@Component({
  selector: 'app-supv-interface',
  templateUrl: './supv-interface.component.html',
  styleUrls: ['./supv-interface.component.css']
})
export class SupvInterfaceComponent implements OnInit {

  assetId = '';
  employee = '';
  pubKey = '';
  date = '';

  constructor(private api: HrApiService) { }

  ngOnInit() {
  }

  approveTimecard() {
    console.log("Approving...");
    this.api.postApproveTimecard(this.assetId, this.date, this.employee, this.pubKey).subscribe((data) => {
      console.log("Approved");
    });
  }

  rejectTimecard() {
    console.log("Rejecting...");
    this.api.postRejectTimecard(this.assetId, this.date, this.employee, this.pubKey).subscribe((data) => {
      console.log("Rejected");
    });
  }
}
