//import Web3 from 'web3';
const Web3 = require('web3');

import { Injectable } from '@angular/core';

@Injectable()
export class MetamaskService {

  constructor() { }

  public test() {
    console.log(window);
  }

  public sign() {
    console.log(window);
    console.log(window['web3']);
    if (typeof window['web3'] === 'undefined') {
      console.log("ERROR: no web3 defined.");
      return;
    }

    console.log(window['web3'].currentProvider);
    console.log(window['web3'].currentProvider.sendAsync);

    let web3 = window['web3'];

    console.log(web3.eth.accounts);
    web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [web3.eth.accounts[0], "0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55"] },
    function(err, result) {
      console.log(result);
      console.log(err);
            let sig = result.result;
	    //dispatch(exchange.authenticate(sig, user))
		     });

    /*
    window['web3'].currentProvider.sendAsync({id: 1, method: 'personal_sign',
      params: [window['web3'].eth.acocunts[0], '0xcc3f10Dc50eDBc58Ec01Ea8783E1945EF5b6Dc55']},
      (err, results) => {
        console.log(results);
	}).subscribe((data) => {});
    */
  }

}
