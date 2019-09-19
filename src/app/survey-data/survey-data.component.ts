
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AssigneesDataComponent } from './assignees-data/assignees-data.component';
import { QuestionsComponent } from './questions/questions.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-survey-data',
  templateUrl: './survey-data.component.html',
  styleUrls: ['./survey-data.component.css']
})

export class SurveyDataComponent implements OnInit {
  raRishabhId: string;
  surveys: any;
  filterSurveys: any;
  selectedSurvey: any;
  surveyTitle: string;
  name: string;
  findSurvey: any;
  checkedUserList: any = [];
  assigneesId: any = [];
  assingeesList: any = [];
  questions: any = new MatTableDataSource();
  assignees: any = new MatTableDataSource();
  displayedColumns: string[] = ['questionText', 'Icons'];
  displayedColumnData: string[] = ['Emp Name', 'RishabhId', 'Icons'];
  surveyUserArr: any = [];
  allUserArr: any = [];
  editSurveyForm: FormGroup;
  userArray: any = [];
  deleteUserList: any = [];
  allSelected = false;
  currentDate = new Date().toDateString();
  selection = new SelectionModel<any>(true, []);
  constructor(private surveyService: SurveyService, private userService: UserService, private fb: FormBuilder,
              private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.raRishabhId = localStorage.getItem('rishabhId');
    this.getAllUser();
    this.getSurveyDataByID();
  }
  // To get list of Survey Id Details of specific RA
  getSurveyDataByID = () => {
    this.surveyService.getSurveyByOwner(this.raRishabhId)
      .subscribe(
        (data: any) => {
          this.filterSurveys = data;
          this.displaySurvey(this.filterSurveys);
        });
  }
  // get all the user's from sql database
  getAllUser = () => {
    this.userService.getUserData(this.name)
      .subscribe((data: any) => {
        this.allUserArr = data.recordset.map(user => user.RishabhId);
      });
  }
  displaySurvey = (surveys) => {
    surveys.filter((survey) => {
      const surveyId = survey._id;
      if (survey.endDate !== '' || survey.endDate !== undefined) {
        if (new Date(survey.endDate) < new Date(this.currentDate)) {
          // this.surveyService.deleteSurvey(surveyId)
          // .subscribe((data) => {
          //   console.log('data on delete selected survey', data);
          // });
          const index = surveys.indexOf(survey);
          surveys.splice(index, 1);
        }
        this.surveys = surveys;
      }
    });
  }
  // display result of selected survey by survey id
  selected = (e) => {
    this.editSurveyForm = this.fb.group({
      title: new FormControl(),
      questions: this.fb.array([]),
      assignees: this.fb.array([])
    });
    this.findSurvey = this.surveys.find(data => data._id === e);
    this.surveyTitle = this.findSurvey.title;
    this.questions = this.findSurvey.questions;
    this.assingeesList = this.findSurvey.assignees;
    this.assigneesId = this.assingeesList.map(arr => arr._id);
    this.getData();

  }
  // get assignees dta under selected survey and rishabhId of assignees
  public getData = () => {
    this.surveyService.getUsername(this.assigneesId)
      .subscribe((data: any) => {
        this.assignees = data;
        this.surveyUserArr = this.assignees.map(user => user.RishabhId);
      });
  }
  // delete selected survey
  deleteSurvey = () => {
    this.surveyService.deleteSurveyById(this.selectedSurvey)
      .subscribe(survey => {
        window.location.reload();
      });
  }
  // open dialog box to add, update and delete questions
  openDialog = (action, obj, i) => {
    obj.action = action;
    obj.index = i;
    const dialogRef = this.dialog.open(QuestionsComponent,
      {
        data: {
          que: obj,
          surveyId: this.selectedSurvey
        },
        width: '340px',
        height: '170px',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }
  // add questions within selected survey
  addRowData = (rowObj: any) => {
    this.questions.push({
      questionText: rowObj.questionText,
      questionType: rowObj.questionType
    });
    this.updateRowData(this.questions);
  }
  // update questions within selected survey
  updateRowData = (rowObj: any) => {
    this.questions = this.questions.filter((value, key) => {
      if (key === rowObj.index) {
        value.questionText = rowObj.questionText;
      }
      return true;
    });
  }
  // delete questions within selected survey
  deleteRowData = (rowObj: any) => {
    this.questions = this.questions.filter((value, key) => {
      return key !== rowObj.index;
    });
    return true;
  }
  // to get all survey user
  getArrayValue = () => {
    let data: boolean;
    this.allUserArr.forEach((user) => {
      data = this.surveyUserArr.includes(user);
      if (data === false) {
        this.userArray.push(user);
      } else {
        if (this.deleteUserList.length > 0) {
          this.surveyUserArr.forEach(surveyUser => {
            const index = this.surveyUserArr.indexOf(surveyUser);
            const surveyData = this.deleteUserList.includes(surveyUser);
            if (surveyData === true) {
              this.surveyUserArr.splice(index, 1);
            }
          });
        }
      }
    });
  }
  // to manage assignees dialog
  editAssignees = (action, obj) => {
    obj.action = action;
    this.getArrayValue();
    const dialogRef = this.dialog.open(AssigneesDataComponent, {
      width: '740px', height: '470px',
      data: {
        surveyId: this.selectedSurvey,
        user: this.userArray,
        object: obj
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.deleteUserList = [];
      this.userArray = [];
      this.checkedUserList = [];
      if (result.event === 'Add') {
        result.data.filter(user => {
          const ele = this.surveyUserArr.includes(user);
          if (ele === false) {
            this.surveyUserArr.push(user);
          }
        });
        this.addAssignees(this.surveyUserArr);
      }
      this.allSelected = false;
    });
  }
  // display assignees after add
  addAssignees = (rowObj: any) => {
    this.surveyService.getIdFromRishabhId(rowObj)
      .subscribe((users: any) => {
        this.assignees = users;
      });
  }
  isAllSelected = () => {
    this.allSelected = false;
    const numSelected = this.selection.selected.length;
    this.checkedUserList = this.selection.selected.map(user => user.RishabhId);
    const numRows = this.assignees.length;
    return (numSelected === numRows ? this.allSelected = true : this.allSelected = false);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = () => {
    this.allSelected === true ?
      this.selection.clear() :
      this.assignees.forEach(row => {
        this.selection.select(row);
      });
  }
  checkboxLabel = (row?: any): string => {
    if (this.selection.selected.length > 0) {
      this.checkedUserList = this.selection.selected.map(user => user.RishabhId);
    }
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.position + 1}`;
  }
  // delete checked assignees from database
  deleteAssignees = (action) => {
    if (action === 'Delete') {
      let value;
      let index;
      for (const user of this.checkedUserList) {
        this.surveyUserArr.forEach(surveyUser => {
          value = this.checkedUserList.includes(surveyUser);
          if (value === true) {
            index = this.surveyUserArr.indexOf(user);
            this.surveyUserArr.splice(index, 1);
          }
        });
      }
      if (this.checkedUserList.length >= this.assignees.length) {
        this.deleteAllUser(this.checkedUserList);
      } else {
        this.displayAssigneesAfterDel(this.checkedUserList);
      }
    }
  }
  // display assignees after all delete
  deleteAllUser = (user) => {
    this.deleteUserList = [];
    this.deleteUserList = user;
    if (this.allSelected === true) {
      this.assignees = [];
    }
    this.selection.clear();
  }

  // display assignees after delete checked user
  displayAssigneesAfterDel = (rowObj: any) => {
    let selectedId;
    rowObj.filter(ele => selectedId = ele);
    this.assignees = this.assignees.filter((value, key) => {
      if (value.RishabhId !== selectedId) {
        return value.RishabhId !== selectedId;
      } else {
        this.deleteUserList = [];
        this.deleteUserList = rowObj;
      }
    });
    this.selection.clear();
  }
  deleteAllAssignees = () => {
    this.isAllSelected() ?
      this.assignees.forEach(row => {
        this.selection.select(row);
        this.assignees.splice(row._id, 1);
      }) :
      this.assignees = [];
  }

  updateSurveyData = () => {
    const title = this.editSurveyForm.controls.title.value;
    if (title === null) {
      this.editSurveyForm.controls.title.setValue(this.surveyTitle);
    }
    const queFormGroups = this.questions.map(que => this.fb.group(que));
    const queFormArray = this.fb.array(queFormGroups);
    const userFormGroups = this.assignees.map(user => this.fb.group(user));
    const userFormArray = this.fb.array(userFormGroups);
    this.editSurveyForm.setControl('questions', queFormArray);
    this.editSurveyForm.setControl('assignees', userFormArray);
  }
  onEditSurvey = () => {
    this.updateSurveyData();
    // console.log(this.editSurveyForm.value);
    this.surveyService.updateSurvey(this.selectedSurvey, this.editSurveyForm.value)
      .subscribe((data) => {
        window.location.reload();
        return data;
      });
  }
}
