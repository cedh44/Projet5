import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect, jest} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';
import {DetailComponent} from './detail.component';
import {SessionApiService} from "../../services/session-api.service";
import {of} from "rxjs";
import {TeacherService} from "../../../../services/teacher.service";


describe('DetailComponent Integration Test Suites', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let matSnackBar: MatSnackBar;

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
      providers: [
        {provide: SessionService, useValue: mockSessionService},
        SessionApiService,
        TeacherService
      ],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('should delete a session', () => {
    // On espionne sessionService et matSnackBar
    const spySessionApiService = jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(''));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    component.delete();
    // On vérifie que sessionApiService.delete.create a bien été appelé
    expect(spySessionApiService).toHaveBeenCalled();
    // On vérifie que matSnackBar.open a bien été appelé avec les bons paramètres
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session deleted !', 'Close', {duration: 3000});
  })

});

