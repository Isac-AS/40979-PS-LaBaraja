import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';
import { User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';
import { AddFriendsToLobbyComponent } from './add-friends-to-lobby/add-friends-to-lobby.component';

@Component({
  selector: 'app-sala-page',
  templateUrl: './sala-page.component.html',
  styleUrls: ['./sala-page.component.css']
})
export class SalaPageComponent implements OnInit {

  currentUserData: User = {
    name: '',
    email: '',
    uid: '',
    password: '',
    profile: 'regular',
    friendList: [],
    inbox: [],
    lobby: '',
  };

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
  ) {
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          if (currentUserData) this.currentUserData = currentUserData;
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

  openFriendListDialog(): void {
    const dialogRef = this.dialog.open(AddFriendsToLobbyComponent, {
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

}
