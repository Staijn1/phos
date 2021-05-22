import { TestBed } from '@angular/core/testing';

import { HTTPConnectionService } from './httpconnection.service';

describe('HTTPConnectionService', () => {
  let service: HTTPConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HTTPConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
