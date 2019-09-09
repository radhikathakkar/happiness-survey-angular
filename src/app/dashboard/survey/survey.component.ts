import { Component, OnInit } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  points: any = [];
  survey = [];
  question: any;
  userId: string;
  surveyId: string;
  titleName: string;
  message: string;
  constructor(private surveyService: SurveyService, private loginService: LoginService) { }
  ngOnInit() {
    this.userId = localStorage.getItem('uid');
    this.surveyService.getUsersFilledSurvey(this.userId)
      .subscribe((result) => {
        this.survey = result;
        if (this.survey.length === 0) {
          this.message = 'Any Survey not assign to you';
        } else {
          this.surveyId = this.survey[0]._id;
          this.titleName = this.survey[0].title;
          this.question = this.survey[0].questions;
        }
      });
    this.loginService.showList();
  }

  onSubmit = () => {
    const generatedObj = [];
    const newObj = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.question.length; i++) {
      const newArray = {
        questionID: this.question[i]._id,
        response: this.points[i]
      };
      newObj.push(newArray);
    }
    newObj.forEach(e => {
      if (e.response === undefined) {

        generatedObj.push({ response: 0 });

      } else {
        generatedObj.push(e);
      }
    });

    this.surveyService.postSurveyResponse(this.surveyId, this.userId, generatedObj)
      .subscribe((result) => {
      });
    location.reload();
    return generatedObj;

  }
  onSelect = (e) => {
    // tslint:disable-next-line:no-string-literal
    const selectedSurvey = this.survey.find(item => item['_id'] === e);
    if (this.survey.length === 0) {
      this.message = 'Any Survey not assign to you';
    } else {
      this.surveyId = selectedSurvey._id;
      this.titleName = selectedSurvey.title;
      this.question = selectedSurvey.questions;
    }
  }
}
