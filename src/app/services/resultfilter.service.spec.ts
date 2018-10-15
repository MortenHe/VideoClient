import { TestBed, inject } from '@angular/core/testing';

import { ResultfilterService } from './resultfilter.service';

describe('ResultfilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultfilterService]
    });
  });

  it('should be created', inject([ResultfilterService], (service: ResultfilterService) => {
    expect(service).toBeTruthy();
  }));
});
