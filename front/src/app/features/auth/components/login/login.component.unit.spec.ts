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

});
