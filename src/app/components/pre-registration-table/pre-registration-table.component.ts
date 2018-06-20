/**
 * TODO: Add docstring explaining component
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-pre-registration-table',
  templateUrl: './pre-registration-table.component.html',
  providers: [
    HttpAdminService,
    AngularFireAuth,
  ],
  styleUrls: ['./pre-registration-table.component.css'],
})
export class PreRegistrationTableComponent implements OnInit, AfterViewInit {
  get user(): firebase.User {
    return this._user;
  }

  set user(value: firebase.User) {
    this._user = value;
  }
  private static preRegCols = ['email', 'uid'];
  private _user: firebase.User;

  public displayedColumns = PreRegistrationTableComponent.preRegCols;
  public dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;


  constructor(public adminService: HttpAdminService, public afAuth: AngularFireAuth, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this._user = user;
        this.onPreRegistrationClick();
      } else {
        console.error('NO USER');
        this.openSnackBar('Error: No User', '');
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  applyFilter(filterValue: string) {
    let mFilterValue = filterValue.trim();
    mFilterValue = filterValue.toLowerCase();
    this.dataSource.filter = mFilterValue;
  }


  onPreRegistrationClick() {
    this.displayedColumns = [];
    this.dataSource.data = [];
    this.adminService.getPreRegistrations(this._user).subscribe((data) => {
      this.displayedColumns = PreRegistrationTableComponent.preRegCols;
      this.dataSource.data = data;
    },                                                          (error) => {
      console.error(error);
      this.openSnackBar('Error: Failed to load data', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}