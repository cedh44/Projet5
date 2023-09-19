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
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

describe('RegisterComponent Test Suites', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>
  let authService: AuthService;
  let router: Router;

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

});
