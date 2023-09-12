import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect, jest} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {SessionApiService} from '../../services/session-api.service';

import {FormComponent} from './form.component';
import {Observable, of} from "rxjs";
import {Session} from "../../interfaces/session.interface";
import {Router} from "@angular/router";

describe('FormComponent Test Suites', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;
  let session$: Observable<Session>
  let session: Session;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        //{ provide: Router, useValue: { navigate : jest.fn() },},
        {provide: SessionService, useValue: mockSessionService},
        //{ provide: MatSnackBar, useValue: { open: jest.fn(),},},
        SessionApiService,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    sessionService = TestBed.inject(SessionService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    session = { // Création d'un observable de type Session avec des données vides
      id: 0,
      name: '',
      description: '',
      date: new Date(),
      teacher_id: 0,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    session$ = of(session);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit form to create session', () => {
    component.onUpdate = false;
    const spySessionApiService = jest.spyOn(sessionApiService, 'create').mockReturnValue(session$);
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.submit();
    // On vérifie que sessionApiService.create a bien été appelé
    expect(spySessionApiService).toHaveBeenCalled();
    // On vérifie que matSnackBar.open a bien été appelé avec les bons paramètres
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session created !', 'Close', {duration: 3000});
    // On vérifie que le navigate vers 'sessions' a été appelé
    expect(spyRouter).toHaveBeenCalledWith(['sessions']);
  });

  it('should call submit form to update session', () => {
    component.onUpdate = true;
    const spySessionApiService = jest.spyOn(sessionApiService, 'update').mockReturnValue(session$);
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.submit();
    // On vérifie que sessionApiService.update a bien été appelé
    expect(spySessionApiService).toHaveBeenCalled();
    // On vérifie que matSnackBar.open a bien été appelé avec les bons paramètres
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session updated !', 'Close', {duration: 3000});
    // On vérifie que le navigate vers 'sessions' a été appelé
    expect(spyRouter).toHaveBeenCalledWith(['sessions']);
  });

});
