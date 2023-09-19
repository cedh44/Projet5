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
import {of} from "rxjs";
import {Session} from "../../interfaces/session.interface";
import {ActivatedRoute, convertToParamMap, Router} from "@angular/router";

describe('FormComponent Test Suites When Init', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: false
    }
  }

  class MockRouter {
    get url(): string {
      return '';
    }

    navigate(): Promise<boolean> {
      return new Promise<boolean>((resolve, _) => resolve(true));
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
        {provide: Router, useClass: MockRouter},
        {provide: SessionService, useValue: mockSessionService},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({id: '1'})}},},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component when not update', () => {
    component.ngOnInit();
    // On vérifie que les données du formulaire sont bien initialisées
    expect(component.sessionForm?.get('name')?.value).toEqual('');
    expect(component.sessionForm?.get('date')?.value).toEqual('');
    expect(component.sessionForm?.get('teacher_id')?.value).toEqual('');
    expect(component.sessionForm?.get('description')?.value).toEqual('');
  })
});

describe('FormComponent Test Suites When Update', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;
  let session: Session;

  const mockSessionService = {
    sessionInformation: {
      admin: false
    }
  }

  class MockSnackBar {
    open() {
      return {
        onAction: () => of({}),
      };
    }
  }

  class MockRouterUpdate {
    get url(): string {
      return 'update';
    }

    navigate(): Promise<boolean> {
      return new Promise<boolean>((resolve, _) => resolve(true));
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
        {provide: Router, useClass: MockRouterUpdate},
        {provide: SessionService, useValue: mockSessionService},
        {provide: MatSnackBar, useClass: MockSnackBar},
        {
          provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({id: '1'})}},
        },
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
  });

  it('should init component when update', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(session));
    component.ngOnInit();
    // On vérifie que sessionApiService.create a bien été appelé
    expect(spySessionApiService).toHaveBeenCalled();
  })

});
