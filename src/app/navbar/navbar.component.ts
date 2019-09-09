import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Users } from '../shared/user';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  ifRa: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe( map(result => result.matches));
  user: Users[] = [];
  // tslint:disable-next-line:variable-name
  constructor(private breakpointObserver: BreakpointObserver, public router: Router, private _LoginService: LoginService) { }
  ngOnInit() {
    this.ifRa = localStorage.getItem('boolean');
  }
  onLogoutClick() {
    localStorage.clear();
    this._LoginService.logoutUser();
  }
}
