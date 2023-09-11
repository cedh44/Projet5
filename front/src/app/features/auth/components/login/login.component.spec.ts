
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { Router } from "@angular/router";
import { SessionInformation } from "../../../../interfaces/sessionInformation.interface";
import { Observable, of } from "rxjs";

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
          provide : Router, //Mock du router
          useValue: {
            navigate : jest.fn(),
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
    component = fixture.componentInstance; //Le composant est "créé"
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit function of login component', () =>{
    const sessionInformation$: Observable<SessionInformation> = of({ // Création d'un observable de type SessionInformation avec des données vides
      token: '',
      type: '',
      id: 0,
      username: '',
      firstName: '',
      lastName: '',
      admin: false,
    });
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(sessionInformation$); // On espionne les services Auth Session et Router
    const spySessionService = jest.spyOn(sessionService, 'logIn')
    const spyRouter = jest.spyOn(router, 'navigate');
    component.submit();
    expect(spyAuthService).toHaveBeenCalled(); //On s'attend à ce que les services Auth Session et Router soient appelés
    expect(spySessionService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
  })

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

});
