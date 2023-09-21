import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {SessionService} from './session.service';

describe('SessionService Test Suites', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(sessionService).toBeTruthy();
  });

});
