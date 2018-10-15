import { TestBed, inject } from '@angular/core/testing';

import { ViewControlService } from './view-control.service';

describe('ViewControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewControlService]
    });
  });

  it('should be created', inject([ViewControlService], (service: ViewControlService) => {
    expect(service).toBeTruthy();
  }));
});
