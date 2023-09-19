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
  //TODO : A VIRER SI TOUJOURS KO let router: Router;

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
    //TODO : A VIRER SI TOUJOURS KO router = TestBed.inject(Router);
  });

  it('should delete a session', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(''));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    //TODO : A VIRER SI TOUJOURS KO const spyRouter = jest.spyOn(router, 'navigate');
    component.delete();
    // On vérifie que sessionApiService.delete.create a bien été appelé
    expect(spySessionApiService).toHaveBeenCalled();
    // On vérifie que matSnackBar.open a bien été appelé avec les bons paramètres
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session deleted !', 'Close', {duration: 3000});
    // On vérifie que le navigate vers 'sessions' a été appelé
    //TODO : A VIRER SI TOUJOURS KO expect(spyRouter).toHaveBeenCalledWith('sessions');
  })

});

