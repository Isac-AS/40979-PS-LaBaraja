import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  rejectFriendRequest(data: InboxInfo) {
    this.db.rejectFriendRequest(data);
  }

  trackItem(index: number, data: InboxInfo) {
    return data.reason + data.receiverId + data.senderId
  }

}
