import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'firebase/auth';
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-sala-page',
  templateUrl: './sala-page.component.html',
  styleUrls: ['./sala-page.component.css']
})
export class SalaPageComponent implements OnInit {

  currentUserData: User |undefined;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
  ) { 
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          this.currentUserData = currentUserData;
        })
      }
    });
  }

  ngOnInit(): void {
  }

  openNotificationDialog(): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: "70%",
      height: "70%"
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

}
