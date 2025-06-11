import { TestBed } from '@angular/core/testing';

import { StatServices } from './stat-services';

describe('StatServices', () => {
  let service: StatServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
