import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {SessionService} from './session.service';
import {Observable} from "rxjs";
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService Test Suites', () => {
  let sessionService: SessionService;
  const mockedSessionInformation: SessionInformation = {
    firstName: 'toto',
    lastName: 'toto',
    admin: false,
    token: 'bearer token',
    type: 'jwt',
    id: 1,
    username: 'toto@gmail.com',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(sessionService).toBeTruthy();
  });

  it('should return if logged or not', () => {
    sessionService.logIn(mockedSessionInformation);
    const isLoggedValue = true;
    const result: Observable<boolean> = sessionService.$isLogged();
    result.subscribe((value) => {
      expect(value).toEqual(isLoggedValue);
    });
  });

  it('should login', () => {
    sessionService.logIn(mockedSessionInformation);
    expect(sessionService.isLogged).toBeTruthy();
  });

  it('should logout', () => {
    sessionService.logOut();
    expect(sessionService.isLogged).toBeFalsy();
  });

});
