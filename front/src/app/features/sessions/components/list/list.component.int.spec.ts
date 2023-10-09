import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { Observable, of, throwError } from "rxjs";
import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('ListComponent Integration Test Suites', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let session$: Observable<Session[]>;
  const sessionInfos: SessionInformation = {
    username: '',
    firstName: '',
    lastName: '',
    id: 0,
    admin: false,
    token: '',
    type: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService }]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ListComponent);
    sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = sessionInfos;
    sessionApiService = TestBed.inject(SessionApiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Création d'un observable de type tableau de session
    session$ = of([{
      name: 'Séance Découverte',
      description: 'Session pour les débutants',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  });

  it('should display Edit if Admin', () => {
    sessionService.sessionInformation!.admin = true;
    // On espionne le service ApiSessionService
    const spySessionApiService = jest.spyOn(sessionApiService, 'all').mockReturnValue(session$);
    // Récupère l'élément contenant le texte "Edit"
    const editElement = fixture.nativeElement.querySelector('span');

    // Vérifie que l'élément contient le texte "Edit"
    expect(editElement.textContent).toContain('Edit');
  });

  it('should not display Edit if user', () => {

  });
});
