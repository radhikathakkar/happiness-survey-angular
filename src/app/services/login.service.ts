import { Injectable } from '@angular/core';
import { Users } from '../shared/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  url = 'http://localhost:3000/';
  constructor(private http: HttpClient, private router: Router) { }

  authLogin(user) {
    return this.http.post(this.url + 'surveys/auth', user);
  }

  loggedIn() {
    return !!localStorage.getItem('user');
  }
  showList() {
    // tslint:disable-next-line:variable-name
    const boolean = localStorage.getItem('boolean');
    if (boolean === 'true' ) {
      return true;
    } else { return false; }
  }
  CheckUser(user) {
    return this.http.post(this.url + 'surveys/Add' , { id: user });
  }
  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
