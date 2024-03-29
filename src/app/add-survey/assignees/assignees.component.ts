import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material';
import { SurveyService } from 'src/app/services/survey.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-assignees',
  templateUrl: './assignees.component.html',
  styleUrls: ['./assignees.component.css']
})
export class AssigneesComponent implements OnInit {

  onAdd = new EventEmitter();
  displayedColumns: string[] = ['EmpName', 'RishabhId', 'DivName', 'Icons'];
  dataSource: any = new MatTableDataSource();
  myForm: FormGroup;
  name: string;
  userArray: any = [];
  userList: string;
  assigneesList: any = [];
  selectedUser: any = [];
  selection = new SelectionModel<any>(true, []);
  constructor(private dialogRef: MatDialogRef<AssigneesComponent>, private fb: FormBuilder, private userService: UserService,
              private surveyService: SurveyService) { this.createArray(); }
  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.getData();
  }
  createArray = () => {
    this.myForm = this.fb.group({
      rishabhId: this.fb.array([])
    });
  }
  // To get Users belongs to specifies RA
  public getData = () => {
    this.userService.getUserData(this.name)
      .subscribe((data: any) => {
        this.dataSource = data.recordset;
      }, err => err);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    this.selectedUser = this.selection.selected.map(user => user.RishabhId);
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  // To get selected user
  onChange = (value, isChecked) => {
    const emailFormArray = this.myForm.controls.rishabhId as FormArray;
    if (isChecked) {
      emailFormArray.push(new FormControl(value.RishabhId));
      localStorage.setItem('RishabhId', value.RishabhId);
    } else {
      const index = emailFormArray.controls.findIndex(x => x.value === value.RishabhId);
      emailFormArray.removeAt(index);
      localStorage.removeItem('RishabhId');
    }
  }
  postUserToSurvey = () => {
    this.userArray = this.selectedUser;
    this.surveyService.postUserByRishabhId(this.userArray)
    .subscribe((data) => {
      this.userList = data.map(user => user._id);
      this.assigneesList.push(this.userList);
    });
    this.dialogRef.close();
    this.onAdd.emit(this.assigneesList);
  }
}
