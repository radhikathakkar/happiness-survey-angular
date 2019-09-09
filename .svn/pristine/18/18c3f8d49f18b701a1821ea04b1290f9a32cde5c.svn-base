import { Component, OnInit } from '@angular/core';
import { Users } from '../shared/user';
import { from } from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  animations: [
    trigger('fade', [
      transition('void=>*', [
        style({ backgroundColor: 'green', opacity: 0 }),
        animate(2000, style({ backgroundColor: 'white', opacity: 1 }))
      ])
    ])
  ]
})
export class HeroesComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  passwordShown: boolean;
  passwordType: string;
  email: string;
  firstname: string;
  lastname: string;
  name: string;
  designation: string;
  survey = [];
  question: any;
  recordset: any;
  userId: string;
  surveyId: string;
  raRishabhId: string;
  constructor(private surveyService: SurveyService, private userService: UserService) { }

  ngOnInit() {
    this.trimUser();
    this.getSurvey();
    this.raEmailId();
  }
  getSurvey() {
    this.userId = localStorage.getItem('uid');
    this.surveyService.getUsersSurvey(this.userId)
      .subscribe((result) => {
        this.survey = result;
        // console.log(' profile result', result);
        this.surveyId = result[0]._id;
        localStorage.setItem('sid', this.surveyId);
      });
  }
  public trimUser = () => {
    this.email = localStorage.getItem('user');
    this.name = this.email.substring(0, this.email.lastIndexOf('@'));
    this.firstname = this.name.split('.')[0];
    this.lastname = this.name.split('.')[1];
    localStorage.setItem('designaion', this.designation);
    localStorage.setItem('name', this.name);
    localStorage.setItem('firstname', this.firstname);
    localStorage.setItem('lastname', this.lastname);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
  raEmailId = () => {
    this.userService.getRAId(this.name)
      .subscribe((data) => {
        this.raRishabhId = data;
        localStorage.setItem('rishabhId', this.raRishabhId);
      });
  }
}
