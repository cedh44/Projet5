import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {UserService} from '../../services/user.service';
import {MeComponent} from './me.component';
import {jest} from "@jest/globals";
import {of} from "rxjs";
import {SessionInformation} from "../../interfaces/sessionInformation.interface";
import {RouterTestingModule} from "@angular/router/testing";

describe('MeComponent Test Suites', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{provide: SessionService, useValue: mockSessionService},
        UserService,
        {
          provide: Router, //Mock du router
          useValue: {
            navigate: jest.fn(),
          },
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {

  });

  it('should call userService.getById ngOnInit', () => {
    const spyUserService = jest.spyOn(userService, 'getById');
    component.ngOnInit();
    expect(spyUserService).toHaveBeenCalled();
  });


  it('should navigate back', () => {
    const spyWindow = jest.spyOn(window.history, 'back');
    component.back();
    expect(spyWindow).toHaveBeenCalled();
  })

  it('should delete a user', () => {
    // Mock session information
    const mockSessionInformation: SessionInformation = {
      token: 'bearer token',
      type: 'jwt',
      id: 1,
      username: 'toto@gmail.com',
      firstName: 'toto',
      lastName: 'toto',
      admin: false,
    };
    sessionService.sessionInformation = mockSessionInformation;

    const spyUserServiceDelete = jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spySessionServiceLogout = jest.spyOn(sessionService, 'logOut');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.delete();
    // On vérifie que userService.delete a bien été appelé
    expect(spyUserServiceDelete).toHaveBeenCalled();
    // On vérifie que matSnackBar.open a bien été appelé avec les bons paramètres
    expect(spyMatSnackBar).toHaveBeenCalledWith('Your account has been deleted !', 'Close', {duration: 3000});
    // On vérifie que sessionService.logOut a bien été appelé
    expect(spySessionServiceLogout).toHaveBeenCalled();
    // On vérifie que le navigate vers '/' a été appelé
    expect(spyRouter).toHaveBeenCalledWith(['/'])
  })
});
