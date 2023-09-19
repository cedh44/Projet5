import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {expect, jest} from '@jest/globals';
import {RegisterComponent} from './register.component';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {of, throwError} from "rxjs";

describe('RegisterComponent Integration Test Suites', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>
  let authService: AuthService;
  let router: Router;
  let registerFormDatas: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
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
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    registerFormDatas = {
      firstName: 'toto',
      lastName: 'titi',
      email: 'toto@gmail.com',
      password: 'toto123!'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make the form incorrect when empty', () => {
    component.form.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form incorrect when email is not filled correctly', () => {
    component.form.setValue({
      //L'email ci dessous n'est pas correct
      firstName: 'toto',
      lastName: 'titi',
      email: 'toto',
      password: 'toto123!',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form valid when all fields are correct', () => {
    component.form.setValue({
      //Les données saisies sont valides
      firstName: 'toto',
      lastName: 'titi',
      email: 'toto@gmail.com',
      password: 'toto123!',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should call submit function of register component with no error', () => {
    // Valorisation du formulaire
    component.form.setValue(registerFormDatas);
    // On espionne les services Auth et Router
    const spyAuthService = jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const spyRouter = jest.spyOn(router, 'navigate');
    //On vérifie si le formulaire est valide
    expect(component.form.valid).toBeTruthy();
    component.submit();
    //On s'attend à ce que les services Auth et Router soient appelés et redirection vers /login
    expect(spyAuthService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  })

  it('should call submit function of register component with  error', () => {
    // On espionne le services Auth
    const spyAuthService = jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error('An error occurred')));
    component.submit();
    //On s'attend à ce que le services Auth soit appelé et que onError soit à true
    expect(spyAuthService).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  })

});
