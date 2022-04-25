import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPageComponent } from 'src/app/components/login-page/login-page.component';
import { RegisterPageComponent } from 'src/app/components/register-page/register-page.component';
import { NotificationDialogComponent } from '../notification-Dialog/notification-Dialog.component';

@Component({
  selector: 'app-pseudoheader',
  templateUrl: './pseudoheader.component.html',
  styleUrls: ['./pseudoheader.component.css']
})
export class PseudoheaderComponent implements OnInit {

  public isLoggedIn: boolean = false;

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.auth.userState().subscribe(res => {
      this.isLoggedIn = !!res;
    })
  }

  ngOnInit() { }

  logOut() {
    const res = this.auth.logout().catch(async error => {
      alert('Parece haber habido un problema. Inténtelo de nuevo.')
    });
    this.router.navigate(['']);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginPageComponent, {
      minWidth: "40%"
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterPageComponent, {
      minWidth: "40%"
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  openNotificationDialog(): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: "70%",
      height: "70%"
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

}
