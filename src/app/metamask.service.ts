//import Web3 from 'web3';
const Web3 = require('web3');

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { HrApiService } from './hr-api.service';

@Injectable()
export class MetamaskService {

  constructor(private api: HrApiService,
              private http: Http) { }

  public test() {
    console.log(window);
  }

  public checkAuth() {
    console.log(window['web3']);
    if (typeof window['web3'] === 'undefined') {
      console.log('ERROR: no web3 defined.');
      return false;
    }

    if (!('ethereum' in window)
        && !('_metamask' in window['ethereum'])
	&& !('isEnabled' in window['ethereum']._metamask)) {
      console.log('ERROR: ethereum.metamask.isEnabled not defined');
      return false;
    }
    console.log(window['ethereum']);
    return window['ethereum']._metamask.isEnabled();
  }

  public sign(message: string) {
    const web3 = window['web3'];

    const payload: string = JSON.stringify(JSON.parse(message).payload)

    web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [web3.eth.accounts[0], message] },
    this.generateWeb3Callback(message,
    this.http, 'https://api.simbachain.com/v1/HR_Chain_V4/transaction',
    '497e05cc72e9b0121cce9363f06721ebd79ffbe9872292208bcb8e240bb48d92'));

  }


  public generateWeb3Callback(message, http, url, apikey) {
    const messageDict = JSON.parse(message)
    const id_str = messageDict.id

    const to = messageDict.payload.raw.to
    const data = messageDict.payload.raw.data.substring(2)

    return function(err, result) {
      const sig = result.result;

      // FIXME: We were unable to figure out exactly which data is supposed to be here and which data
      // FIXME: we were supposed to sign. Their documentation doesn't specify it anywhere.
      const payload = to + data + sig.substring(2)
      console.log(payload)
      const body = {
        'payload': payload,
      };
      const options = new RequestOptions({
        headers: new Headers({
          'APIKEY': apikey
          }),
      });
      http.post(url + '/' + id_str + '/', body, options).subscribe((data) => {console.log(data); });
    };
  }
}
