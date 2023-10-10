import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';

import {of} from "rxjs";
import {ListComponent} from './list.component';
import {Session} from '../../interfaces/session.interface';
import {SessionApiService} from '../../services/session-api.service';
import {SessionInformation} from 'src/app/interfaces/sessionInformation.interface';
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

class mockSessionApiService {
  //On mock sessionApiService.all pour avoir 2 sessions à la création du composant
  all() {
    return of([
      {id: 1, name: 'Session pour les nouveaux', date: new Date(), description: 'Session pour les nouveaux'},
      {id: 2, name: 'Session pour les pros', date: new Date(), description: 'Session pour les pros'},
    ] as Session[]);
  }
}

describe('ListComponent Integration Test Suites', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let router: Router;
  const sessionInfos: SessionInformation = {
    username: '',
    firstName: '',
    lastName: '',
    id: 0,
    admin: true,
    token: '',
    type: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
      providers: [
        {provide: SessionService},
        {provide: SessionApiService, useClass: mockSessionApiService}
      ]
    })
      .compileComponents();
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService.sessionInformation = sessionInfos;
    fixture.detectChanges();
  });

  it('should display sessions and buttons Create and Edit for Admin User', () => {
    // Admin
    sessionService.sessionInformation!.admin = true;
    fixture.detectChanges();
    // On s'assure qu'il y a bien deux éléments .item correspondant aux 2 sessions
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    // On s'assure qu'il y a bien le bouton create
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeTruthy();
    // On s'ssure qu'il y a bien le bouton update (edit) sur la première sessions
    const editButton = fixture.nativeElement.querySelector('[ng-reflect-router-link="update,1"]');
    expect(editButton).toBeTruthy();
  });

  it('should display sessions and not buttons Create and Edit for User', () => {
    // Pas admin
    sessionService.sessionInformation!.admin = false;
    fixture.detectChanges();
    // On s'assure qu'il y a bien deux éléments .item correspondant aux 2 sessions
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    // On s'assure qu'il n'y a pas le bouton create
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeFalsy();
    // On s'assure qu'il n'y a pas le bouton update (edit)
    const editButton = fixture.nativeElement.querySelector('[ng-reflect-router-link="update,1"]');
    expect(editButton).toBeFalsy();
  });
});
