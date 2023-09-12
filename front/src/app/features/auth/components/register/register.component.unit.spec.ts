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
import {of} from "rxjs";

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

  it('should call submit function of register component', () => {
    // On espionne les services Auth et Router
    const spyAuthService = jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const spyRouter = jest.spyOn(router, 'navigate');
    component.submit();
    //On s'attend à ce que les services Auth et Router soient appelés
    expect(spyAuthService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  })

});
