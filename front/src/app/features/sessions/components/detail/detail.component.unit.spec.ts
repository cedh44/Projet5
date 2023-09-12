import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect, jest} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';
import {DetailComponent} from './detail.component';
import {SessionApiService} from "../../services/session-api.service";
import {Router} from "@angular/router";
import {of} from "rxjs";


describe('DetailComponent Test Suites', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [{provide: SessionService, useValue: mockSessionService}],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate back', () => {
    const spyWindow = jest.spyOn(window.history, 'back');
    component.back();
    expect(spyWindow).toHaveBeenCalled();
  })

  it('should delete a user', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(''));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.delete();
    expect(spySessionApiService).toHaveBeenCalled();
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session deleted !', 'Close', {duration: 3000});
    expect(spyRouter).toHaveBeenCalledWith('sessions');
  })

  it('should participate a user', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'participate');
    component.participate();
    expect(spySessionApiService).toHaveBeenCalled();
  })

  it('should unparticipate a user', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'unParticipate');
    component.unParticipate();
    expect(spySessionApiService).toHaveBeenCalled();
  })
});

