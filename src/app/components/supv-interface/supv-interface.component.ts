import { Component, OnInit } from '@angular/core';
import { HrApiService } from '../../hr-api.service';
import { MetamaskService } from '../../metamask.service';

@Component({
  selector: 'app-supv-interface',
  templateUrl: './supv-interface.component.html',
  styleUrls: ['./supv-interface.component.css']
})
export class SupvInterfaceComponent implements OnInit {

  employee = '';
  pubKey = '';
  date = '';

  constructor(private api: HrApiService,
              private metamask: MetamaskService) { }

  ngOnInit() {
  }

  approveTimecard() {
    console.log('Approving...');
    this.api.postApproveTimecard(this.date, this.employee, this.pubKey).subscribe((data) => {
      console.log('Approved');
      console.log(data);
      this.metamask.sign(data['_body']);
    });
  }

  rejectTimecard() {
    console.log('Rejecting...');
    this.api.postRejectTimecard(this.date, this.employee, this.pubKey).subscribe((data) => {
      console.log('Rejected');
      this.metamask.sign(data['_body']);
    });
  }
}
