import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InboxInfo, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-notofication-Dialog',
  templateUrl: './notification-Dialog.component.html',
  styleUrls: ['./notification-Dialog.component.css']
})
export class NotificationDialogComponent implements OnInit {

  public inbox: InboxInfo[];

  constructor(
    private auth: AuthService,
    private db: databaseService,
    private router: Router,
    public dialogRef: MatDialogRef<NotificationDialogComponent>
  ) {
    this.inbox = [];
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          this.inbox = currentUserData!?.inbox;
        })
      }
    });
  }

  ngOnInit() { }

  acceptFriendRequest(data: InboxInfo) {
    this.db.acceptFriendRequest(data);
  }

  removeFromInbox(data: InboxInfo) {
    this.db.removeFromInbox(data);
  }

  acceptJoinRequest(data: InboxInfo) {
    this.db.acceptLobbyRequest(data);
  }

  joinGame(data: InboxInfo) {
    this.db.joinGame(data);
    this.dialogRef.close();
    this.router.navigate(['/board']);
  }

  trackItem(index: number, data: InboxInfo) {
    return data.reason + data.receiverId + data.senderId
  }

}
