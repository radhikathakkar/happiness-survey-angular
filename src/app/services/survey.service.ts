import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Survey } from '../shared/survey';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  baseUrl = 'http://localhost:3000/surveys';
  url = 'http://localhost:3000/survey';
  constructor(private http: HttpClient, private router: Router) { }

  getSurveyByOwner(ownerID: string) {
    return this.http.get<any>(`${this.url}/data/${ownerID}`)
      .pipe(res => res);
  }
  postSurvey = (survey: Survey): Observable<any> => {
    return this.http.post(this.url, survey);
  }
  updateSurvey = (surveyId: string, survey: Survey): Observable<any> => {
    return this.http.put(`${this.url}/${surveyId}`, survey);
  }
  getUsersSurvey(id: string) {
    return this.http.get<any>(`${this.baseUrl}/find` + `/${id}`);
  }
  getUsersFilledSurvey(id: string) {
    return this.http.get<any>(`${this.baseUrl}/get` + `/${id}`);
  }
  getUnderSurvey(id: string) {
    return this.http.post<any>(`${this.baseUrl}/find`, { id});
  }
  postSurveyResponse(sid: string, uid: string, e: any) {
    return this.http.put<any>(`${this.baseUrl}` + `/${sid}/response/` + `${uid}`, { response: e });
  }
  getSurveyResponse(sid: string, uid: string) {
    return this.http.get<any>(`${this.baseUrl}` + `/${sid}/response/` + `${uid}`);
  }
  postUserByRishabhId = (RishabhId: any): Observable<any> => {
    return this.http.post(`${this.url}/postuserdata`, {RishabhId})
      .pipe(res => res);
  }
  getUsername = (userId: any): Observable<any> => {
    return this.http.post(`${this.url}/username`, {userId})
    .pipe(res => res);
  }
  deleteSurveyById = (surveyId: string) => {
    return this.http.delete(`${this.url}/${surveyId}`)
    .pipe(res => res);
  }
  getIdFromRishabhId = (RishabhId: string): Observable<any> => {
    return this.http.post(`${this.url}/RishabhId`, {RishabhId})
      .pipe(res => res);
  }
  getAssignees = (surveyId: string) => {
    return this.http.get(`${this.url}/${surveyId}/assignees`)
    .pipe(res => res);
  }

}
