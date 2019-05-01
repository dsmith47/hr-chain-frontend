//import Web3 from 'web3';
const Web3 = require('web3');

import { Injectable } from '@angular/core';

@Injectable()
export class MetamaskService {

  constructor() { }

  public test() {
    console.log(window);
  }

  public checkAuth() {
    console.log(window['web3']);
    if (typeof window['web3'] === 'undefined') {
      console.log("ERROR: no web3 defined.");
      return false;
    }

    if (!('ethereum' in window) 
        && !('_metamask' in window['ethereum'])
	&& !('isEnabled' in window['ethereum']._metamask)) {
      console.log("ERROR: ethereum.metamask.isEnabled not defined");

      return false;
    }
    console.log(window['ethereum']);
    return window['ethereum']._metamask.isEnabled();
  }

  public sign() {
    let web3 = window['web3'];
    console.log(web3.eth.accounts);
    web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [web3.eth.accounts[0], "0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55"] },
    function(err, result) {
      console.log(result);
      console.log(err);
      let sig = result.result;
      console.log(sig);
     });
  }

}
