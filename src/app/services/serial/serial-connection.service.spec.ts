import {TestBed} from '@angular/core/testing';

import {SerialConnectionService} from './serial-connection.service';

describe('SerialConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerialConnectionService = TestBed.get(SerialConnectionService);
    expect(service).toBeTruthy();
  });
});
