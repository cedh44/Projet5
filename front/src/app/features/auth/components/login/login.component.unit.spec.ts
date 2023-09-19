import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect, jest} from '@jest/globals';
import {LoginComponent} from './login.component';
import {Observable, of, throwError} from "rxjs";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {SessionService} from "../../../../services/session.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

describe('LoginComponent Test Suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;

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
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent); //Permet de créer un composant de test "virtuel"
    component = fixture.componentInstance; //Le composant est "créé
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make the form incorrect when empty', () => {
    component.form.setValue({
      email: '',
      password: '',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form incorrect when the fields are not filled correctly', () => {
    component.form.setValue({
      //L'email ci dessous n'est pas correct
      email: 'toto',
      password: 'toto123!',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form valid when all fields are correct', () => {
    component.form.setValue({
      //Le couplet email et password est valide
      email: 'toto@gmail.com',
      password: 'toto123!',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should call submit function of login component and return values', () => {
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
    // Valorisation du formulaire
    // On espionne les services Auth Session et Router
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(sessionInformation$);
    const spySessionService = jest.spyOn(sessionService, 'logIn').mockImplementation(() => {
    });
    const spyRouter = jest.spyOn(router, 'navigate');
    // On vérifie si le formulaire est valide
    component.submit();
    // On vérifie que authService.login et sessionService.logIn ont bien été appelés
    expect(spyAuthService).toHaveBeenCalled();
    expect(spySessionService).toHaveBeenCalled();
    // On vérifie que le navigate vers '/sessions' a été appelé
    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
  })

  it('should call submit function of login component and return error', () => {
    // On espionne le service authService
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('An error occurred')));
    component.submit();
    // On vérifie que authService.login a bien été appelée
    expect(spyAuthService).toHaveBeenCalled();
  })

});
