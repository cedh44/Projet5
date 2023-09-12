import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';

import {ListComponent} from './list.component';

describe('ListComponent Test Suites', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{provide: SessionService, useValue: mockSessionService}]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ListComponent);
    sessionService = TestBed.inject(SessionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user information', () => {
    //Admin de SessionInformation du mockService est défini en tant que true
    expect(component.user?.admin).toBe(true);
  });

});
