import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {User} from "../interfaces/user.interface";

describe('UserService Test Suites', () => {
  let userService: UserService;
  //Nécessaire pour les tests http (angular.io/guide/http-test-requests)
  let httpTestingController: HttpTestingController;
  const pathService = 'api/user';

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

  it('should get a user by Id', () => {
    const mockIdUser: string = '1';
    const expectedUser: User =
      {
        id: 1,
        email: 'toto@gmail.com',
        lastName: 'toto',
        firstName: 'toto',
        admin: false,
        password: 'toto123!',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    userService.getById(mockIdUser).subscribe(
      userReturned => expect(userReturned).toEqual(expectedUser)
    );
    // La fonction expectOne correspondra à l'url de requête
    const req = httpTestingController.expectOne(pathService + '/' + mockIdUser);
    // On s'assure que la requêt est un GET
    expect(req.request.method).toEqual('GET');
    // Retourne la requête
    req.flush(expectedUser);
    // On s'assure qu'il n'y a plus de demande en suspens
    httpTestingController.verify();
  });

  it('should delete a user by Id', () => {
    const mockIdUser: string = '1';
    userService.delete(mockIdUser).subscribe({
        next: () => {
        },
      }
    );
    // La fonction expectOne correspondra à l'url de requête
    const req = httpTestingController.expectOne(pathService + '/' + mockIdUser);
    // On s'assure que la requêt est un DELETE
    expect(req.request.method).toEqual('DELETE');
    // Retourne la requête
    req.flush({});
    // On s'assure qu'il n'y a plus de demande en suspens
    httpTestingController.verify();
  });
});
