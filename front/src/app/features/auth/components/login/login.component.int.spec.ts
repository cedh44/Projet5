import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from "@angular/router";
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { Observable, of, throwError } from "rxjs";
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from "../../../../interfaces/sessionInformation.interface";
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent Integration Test Suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ // TestBed ; Configures and initializes environment for unit testing and provides methods for creating components and services in unit tests.
      declarations: [LoginComponent],
      providers: [
        SessionService,
        AuthService,
        {
          provide: Router, //Mock du router
          useValue: {
            navigate: jest.fn(),
          },
        }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent); //Permet de créer un composant de test "virtuel"
    component = fixture.componentInstance; //Le composant est "créé"
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    controller = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should call submit function of login component OK and return values', () => {
    // Valorisation du formulaire
    component.form.setValue({
      email: 'toto@gmail.com',
      password: 'toto123!',
    });
    // Création d'un observable de type SessionInformation
    const sessionInformation$: Observable<SessionInformation> = of({
      token: 'bearer token',
      type: 'jwt',
      id: 0,
      username: 'toto@gmail.com',
      firstName: 'toto',
      lastName: 'toto',
      admin: false,
    });
    // On espionne les services Auth Session et Router
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(sessionInformation$);
    const spySessionService = jest.spyOn(sessionService, 'logIn').mockImplementation(() => {
    });
    const spyRouter = jest.spyOn(router, 'navigate');
    // On vérifie si le formulaire est valide
    expect(component.form.valid).toBeTruthy();
    component.submit();
    // On vérifie que authService.login et sessionService.logIn ont bien été appelés
    expect(spyAuthService).toHaveBeenCalled();
    expect(spySessionService).toHaveBeenCalled();
    // On vérifie que le navigate vers '/sessions' a été appelé
    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBeFalsy();
  })

  it('should call submit function of login component with email unregisterd and return error', () => {
    // Valorisation du formulaire
    component.form.setValue({
      email: 'emailInexistantEnBase@gmail.com',
      password: 'toto123!',
    });
    // On espionne le service authService
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('An error occurred')));
    // On vérifie si le formulaire est valide
    expect(component.form.valid).toBeTruthy();
    component.submit();
    // On vérifie que authService.login a bien été appelée
    expect(spyAuthService).toHaveBeenCalled();
    // On vérifie que l'erreur est bien présente
    expect(component.onError).toBeTruthy();
  })

  it('should set on error to true when the login request fails', () => {
    // On espionne le service authService
    const spyAuthService = jest.spyOn(authService, 'login');
    component.submit();
    
    //On simule un retour UNAUTHORIZED
    fixture.whenStable().then(() => {
      const request = controller.expectOne('api/auth/login');
      request.flush('Unauthorized', {
        status: 401,
        statusText: 'UNAUTHORIZED',
      });
      // On vérifie que authService.login a bien été appelée
      expect(spyAuthService).toHaveBeenCalled();
      // On vérifie que l'erreur est bien présente
      expect(component.onError).toBeTruthy();
    });
  });

});
