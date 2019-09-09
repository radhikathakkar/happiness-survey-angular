import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { UserService } from '../services/user.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['EmpCode', 'EmpName', 'RishabhId', 'Designation', 'DeptName', 'DivName', 'DateOfJoin'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  name: string;
  constructor(public dialog: MatDialog, private userService: UserService) {}
  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.dataSource.paginator = this.paginator;
    this.getData();
  }
  // To get Users belongs to specifies RA
  public getData = () => {
    this.userService.getUserData(this.name)
      .subscribe((data: any) => {
        this.dataSource = data.recordset;
      }, (err) => err);
  }
  // To apply Filter on available User's Data
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
