import { Component, OnInit } from '@angular/core';

import { HrApiService } from '../../hr-api.service';
import { Globals } from '../../global';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [ Globals ]
})
export class AuthComponent implements OnInit {

  pubKey:string = "";
  privKey:string = "";

  error:string = "";

  constructor(private api:HrApiService) { }

  ngOnInit() {
  }

  submitAuth() {
    console.log("Attempting login...");
    if (this.pubKey.length < 1 || this.privKey.length < 1) {
      this.error = "Must specify a public key and a private key";
      return;
    }
    this.api.getEmployee(this.pubKey).subscribe((data) => {
      let d = JSON.parse(data._body).results[0].payload.inputs;
      console.log(d);
      Globals.pubKey = d.public_key;
      console.log(Globals.pubKey);
    });
  }
}
