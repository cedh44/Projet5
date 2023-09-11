import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { MeComponent } from './me.component';
import {jest} from "@jest/globals";

describe('MeComponent Test Suites', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService },
        { provide : Router, useValue: { navigate : jest.fn()},}] //Mock du router
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const spyUserService = jest.spyOn(userService, 'delete');
    component.delete()
    expect(spyUserService).toHaveBeenCalled();
  })
});
