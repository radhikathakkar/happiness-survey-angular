import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SurveyService } from 'src/app/services/survey.service';
import { AssigneesComponent } from './assignees/assignees.component';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit {
  assignees: any = [];
  raRishabhId: string;
  name: string;
  addSurveyForm: FormGroup;
  assigneesList: Array<any> = [];
  id: string;
  idArr: any = [];
  constructor(private fb: FormBuilder, private surveyService: SurveyService, private dialog: MatDialog) {
    this.createSurvey();
  }
  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.raRishabhId = localStorage.getItem('rishabhId');
  }
  public createSurvey = () => {
    this.addSurveyForm = this.fb.group({
      ownerID: new FormControl(),
      title: ['', Validators.required],
      questions: this.fb.array([this.createQuestions()]),
      assignees: this.fb.array([])
    });
  }
  pushAssignees = () => {
    this.assigneesList.forEach(user => this.idArr = user);
    this.idArr.forEach(x => {
      this.id = x;
      const assignees = this.addSurveyForm.get('assignees');
      (assignees as FormArray).push(this.fb.group({
        _id: this.id,
        response: this.fb.array([])
      }));
    });
  }
  createQuestions = (): FormGroup => {
    return this.fb.group({
      questionText: ['', Validators.required],
      questionType: 'String',
    });
  }
  // To add next question's textbox
  addNextQuestion = () => {
    (this.addSurveyForm.controls.questions as FormArray).push(this.createQuestions());
  }
  // perform delete operation on questions textbox
  deleteQuestion = (index: number): void => {
    const arrayControl = this.addSurveyForm.controls.questions as FormArray;
    if (index >= 1) {
      arrayControl.removeAt(index);
    }
  }
  // To display assignees list
  addAssignees = () => {
    const dialogRef = this.dialog.open(AssigneesComponent, {
      width: '700px', height: '400px',
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((user) => {
      this.assigneesList = user;
    });
  }
  // To add Survey
  onSubmit = () => {
    this.pushAssignees();
    this.addSurveyForm.controls.ownerID.setValue(this.raRishabhId);
    this.surveyService.postSurvey(this.addSurveyForm.value)
      .subscribe(data => data);
    this.addSurveyForm.reset();
    window.location.reload();
  }
}
