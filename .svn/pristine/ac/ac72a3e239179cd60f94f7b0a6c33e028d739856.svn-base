import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  id: any;
  surveyId: string;
  action: string;
  localData: any;
  editQuestionForm: FormGroup;
  constructor(private dialogRef: MatDialogRef<QuestionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.surveyId = data.surveyId;
    this.localData = { ...data.que };
    this.action = this.localData.action;
    this.id = this.localData._id;
    this.createQuestionForm();
  }
  ngOnInit() { }
  public createQuestionForm = () => {
    this.editQuestionForm = this.fb.group({
      questions: this.fb.array([this.createQuestions()]),
    });
  }
  createQuestions = (): FormGroup => {
    return this.fb.group({
      questionText: '',
      questionType: 'String',
    });
  }
  addQuestion = () => {
    this.localData.questionText = this.editQuestionForm.value.questions[0].questionText;
    this.localData.questionType = this.editQuestionForm.value.questions[0].questionType;
  }
  updateQuestion = () => {
    this.localData.questionText = this.editQuestionForm.value.questions[0].questionText;
    this.localData.questionType = this.editQuestionForm.value.questions[0].questionType;
  }
  removeQuestion = (index) => {
      (this.editQuestionForm.controls.questions as FormArray).removeAt(index);
  }
  onSubmit = () => {
    if (this.action === 'Update') {
      this.updateQuestion();
    } else if (this.action === 'Add') {
      this.addQuestion();
    } else if (this.action === 'Delete') {
      this.removeQuestion(this.id);
    }
    this.dialogRef.close({ event: this.action, data: this.localData });
  }
  closeDialog = () => {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

