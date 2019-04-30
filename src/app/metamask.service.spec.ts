/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MetamaskService } from './metamask.service';

describe('MetamaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetamaskService]
    });
  });

  it('should ...', inject([MetamaskService], (service: MetamaskService) => {
    expect(service).toBeTruthy();
  }));
});
