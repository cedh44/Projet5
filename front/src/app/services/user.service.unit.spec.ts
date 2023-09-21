import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('UserService Test Suites', () => {
  let userService: UserService;
  //Nécessaire pour les tests http (angular.io/guide/http-test-requests)
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    userService = TestBed.inject(UserService);
    // Inject the http test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
});
