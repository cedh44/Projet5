import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {FormComponent} from './form.component';
import {ActivatedRoute, convertToParamMap, Router} from "@angular/router";

describe('FormComponent Test Suites When Init/Create', () => {
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

  it('should init component when init', () => {
    component.ngOnInit();
    // On vérifie que les données du formulaire sont bien initialisées
    expect(component.sessionForm?.get('name')?.value).toEqual('');
    expect(component.sessionForm?.get('date')?.value).toEqual('');
    expect(component.sessionForm?.get('teacher_id')?.value).toEqual('');
    expect(component.sessionForm?.get('description')?.value).toEqual('');
  })

  it('should make the form incorrect when empty', () => {
    component.sessionForm?.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    })
    expect(component.sessionForm?.valid).toBeFalsy();
  });
});
