/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HrApiService } from './hr-api.service';

describe('HrApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HrApiService]
    });
  });

  it('should ...', inject([HrApiService], (service: HrApiService) => {
    expect(service).toBeTruthy();
  }));
});
