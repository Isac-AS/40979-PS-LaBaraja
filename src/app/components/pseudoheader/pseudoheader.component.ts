import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
      await alert('Parece haber habido un problema. Inténtelo de nuevo.')
    });
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    /*const dialogRef = this.dialog.open(HeaderResponsiveDialogComponent, {
      data: { login: this.isLoggedIn,
              admin: this.isAdmin
            },
      width: '70%',
      height: '100%',
      position: {
        left: '0px'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
    });*/
  }

}
