import {HttpClientTestingModule, HttpTestingController,} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';
import {AuthService} from './auth.service';
import {RegisterRequest} from "../interfaces/registerRequest.interface";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {SessionInformation} from "../../../interfaces/sessionInformation.interface";

describe('AuthService Test Suites', () => {
  let authService: AuthService;
  //Nécessaire pour les tests http (angular.io/guide/http-test-requests)
  let httpTestingController: HttpTestingController;
  const pathService = 'api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    authService = TestBed.inject(AuthService);
    // Inject the http test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should register', () => {
    // On prépare une requête Register mockée
    const mockRegisterRequest: RegisterRequest = {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    }
    // On appelle la requête via la méthode register avec la requête mockée en paramètre
    authService.register(mockRegisterRequest).subscribe({
      next: () => {
      },
    });
    // La fonction expectOne correspondra à l'url de requête
    const req = httpTestingController.expectOne(pathService + '/register');
    // On s'assure que la requêt est un POST
    expect(req.request.method).toEqual('POST');
    // Retourne la requête
    req.flush({});
    // On s'assure qu'il n'y a plus de demande en suspens
    httpTestingController.verify();
  });

  it('should login', () => {
    // On prépare une requête Login mockée
    const mockLoginRequest: LoginRequest = {
      email: 'toto@gmail.com',
      password: 'toto123!'
    }
    // On s'attend à avoir une sessionInfo mockée
    const expectedSessionInfo: SessionInformation = {
      id: 1,
      username: 'toto@gmail.com',
      firstName: 'toto',
      lastName: 'tata',
      token: 'my bearer token',
      type: 'jwt',
      admin: false,
    };
    // On appelle la requête via la méthode register avec la requête mockée en paramètre
    authService.login(mockLoginRequest).subscribe(
      sessionInfoReturned => expect(sessionInfoReturned).toEqual(expectedSessionInfo)
    );
    // La fonction expectOne correspondra à l'url de requête
    const req = httpTestingController.expectOne(pathService + '/login');
    // On s'assure que la requêt est un POST
    expect(req.request.method).toEqual('POST');
    // Retourne la requête
    req.flush(expectedSessionInfo);
    // On s'assure qu'il n'y a plus de demande en suspens
    httpTestingController.verify();
  });

});
