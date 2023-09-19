import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {TeacherService} from './teacher.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Teacher} from "../interfaces/teacher.interface";

describe('TeacherService Test Suites', () => {
  let teacherService: TeacherService;
  //Nécessaire pour les tests http (angular.io/guide/http-test-requests)
  let httpTestingController: HttpTestingController;
  const pathService = 'api/teacher';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    // Inject the http test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    teacherService = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(teacherService).toBeTruthy();
  });

  it('should get all teachers', () => {
      const expectedTeachers: Teacher[] =
        [
          {
            id: 1,
            lastName: 'tutu',
            firstName: 'tutu',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            lastName: 'tyty',
            firstName: 'tyty',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

      teacherService.all().subscribe(
        teachersReturned => expect(teachersReturned).toEqual(expectedTeachers)
      );
      // La fonction expectOne correspondra à l'url de requête
      const req = httpTestingController.expectOne(pathService);
      // On s'assure que la requêt est un GET
      expect(req.request.method).toEqual('GET');
      // Retourne la requête
      req.flush(expectedTeachers);
      // On s'assure qu'il n'y a plus de demande en suspens
      httpTestingController.verify();
    }
  )

  it('should get the details of a teacher by Id', () => {
      const mockIdTeacher: string = '1';
      const expectedTeacher: Teacher =
        {
          id: 1,
          lastName: 'tutu',
          firstName: 'tutu',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      teacherService.detail(mockIdTeacher).subscribe(
        teachersReturned => expect(teachersReturned).toEqual(expectedTeacher)
      );
      // La fonction expectOne correspondra à l'url de requête
      const req = httpTestingController.expectOne(pathService + '/' + mockIdTeacher);
      // On s'assure que la requêt est un GET
      expect(req.request.method).toEqual('GET');
      // Retourne la requête
      req.flush(expectedTeacher);
      // On s'assure qu'il n'y a plus de demande en suspens
      httpTestingController.verify();

    }
  )
});
