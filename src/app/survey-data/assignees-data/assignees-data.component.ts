import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatTable } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { SurveyService } from 'src/app/services/survey.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-assignees-data',
  templateUrl: './assignees-data.component.html',
  styleUrls: ['./assignees-data.component.css']
})
export class AssigneesDataComponent implements OnInit {

  displayedColumns: string[] = ['EmpName', 'RishabhId', 'Designation', 'DivName', 'Icons'];
  dataSource: any = new MatTableDataSource();
  surveyId: string;
  selectedUser: any = [];
  name: string;
  userArray: any = [];
  allUser: any = [];
  userList: any = [];
  action: string;
  localData: any;
  arrrr: any = [];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  constructor(private dialogRef: MatDialogRef<AssigneesDataComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService, private surveyService: SurveyService) {
    this.surveyId = data.surveyId;
    this.localData = { ...data.object };
    this.action = this.localData.action;
    this.userArray = [];
    this.userArray = data.user;
    console.log('userArray at assi com', this.userArray);
  }
  // ngOnChanges()	{

  // }
  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.getData();
  }

  public getData = () => {
    this.surveyService.getAssignees(this.surveyId)
      .subscribe((data) => {
        let arr: any = [];
        arr = data;
        if (arr.length === 0) {
          this.getAllUser();
        } else {
          this.getRemainUser();
        }
      });
  }
  getAllUser = () => {
    this.userService.getUserData(this.name)
      .subscribe((data: any) => {
        this.dataSource = data.recordset;
      });
  }
  removeData = (obj) => {
    this.dataSource.map((user) => {
      console.log('user at add data ass', user.RishabhId);
      obj.forEach(data => {
        let index;
        index = obj.indexOf(data);
        console.log('data at add data ass', data);
        if (data === user.RishabhId) {
          this.dataSource.splice(index, 1);
          return this.dataSource;
        } else {
          return false;
        }
      });
    });
  //  this.disp(this.dataSource);
  }
  // disp(obj) {
  //   this.dataSource = obj;
  // }
  getRemainUser = () => {
    this.userService.getUserData(this.name)
      .subscribe((data: any) => {
        let value;
        this.allUser = [];
        data.recordset.forEach(user => {
          value = this.userArray ? this.userArray.includes(user.RishabhId) : false;
          if (value === true) {
            this.allUser.push(user);
          }
        });
        this.dataSource = this.allUser;
      }, err => err);
  }
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    this.selectedUser = this.selection.selected.map(user => user.RishabhId);
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle = () => {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => {
        this.selection.select(row);
      });
  }
  checkboxLabel = (row?: any): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.position + 1}`;
    }
  }
  onSubmit = () => {
    this.userArray = this.selectedUser;
    this.dialogRef.close({ event: this.action, data: this.selectedUser });
    this.removeData(this.selectedUser);
    console.log('userArray at assi com after submit', this.userArray);
  }
  closeDialog = () => {
    this.dialogRef.close({ event: 'Cancel' });
  }
}