import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../../hr-api.service';
import { MetamaskService } from '../../metamask.service';
import { Globals } from '../../global';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [ Globals ]
})
export class AuthComponent implements OnInit {

  pubKey = '';
  privKey = '';

  error = '';

  auth_available = false;

  constructor(private api: HrApiService,
              private metamask: MetamaskService) { }

  ngOnInit() {
    this.auth_available = this.metamask.checkAuth();
  }

  submitAuth() {
    console.log('Attempting login...');
    /*
    if (this.pubKey.length < 1 || this.privKey.length < 1) {
      this.error = 'Must specify a public key and a private key';
      return;
    }
    this.api.getEmployee(this.pubKey).subscribe((data) => {
      const d = JSON.parse(data._body).results[0].payload.inputs;
      console.log(d);
      Globals.pubKey = d.public_key;
      console.log(Globals.pubKey);
    });
    */
  }
}
