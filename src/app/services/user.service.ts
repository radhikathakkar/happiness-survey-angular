import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../shared/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  getUserData = (domainId: string): Observable<any> => {
    return this.http.get(`${this.url}/sql/user/${domainId}`)
      .pipe(map(res => res));
  }
  getRAId = (domainId: string): Observable<any> => {
    return this.http.get(`${this.url}/sql/ra/${domainId}`)
      .pipe(map(res => res));
  }

  getUserByRishabhId = (rishabhId: string): Observable<any> => {
    console.log('rishabhId of sql =', {rishabhId});
    return this.http.post(`${this.url}/sql/sqlData`, {rishabhId})
    .pipe(res => res);
  }
}
