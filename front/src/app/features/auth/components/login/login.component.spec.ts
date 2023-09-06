/**
 * @jest-environment jsdom
 */

//import '@testing-library/jest-dom'
//import { getByRole, getByTestId, getByLabelText } from '@testing-library/dom'

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';

describe('LoginComponent Test Suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent); //permet de créer un composant de test "virtuel"
    component = fixture.componentInstance; //le composant est "créé"
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Pour mocker : utiliser spy et Jest (Jest.spyOn(serviceAMocker)), pour les services authService et sessionService
  // En test unitaire, juste lancer la fonction submit (sans email et password complété)
  // S'assurer qu'elle a été called (toHaveBeenCalled chercher par là)




});
