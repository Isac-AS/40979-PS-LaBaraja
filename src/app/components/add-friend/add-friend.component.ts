import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { InboxInfo, NameMapper, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

  id = new FormControl('');

  private inboxMessage: InboxInfo = {
    reason: 'AddFriend',
    senderId: '',
    receiverId: '',
    senderName: '',
    receiverName: '',
    lobbyId: '',
  }

  constructor(
    private auth: AuthService,
    private db: databaseService,
    public dialogRef: MatDialogRef<AddFriendComponent>
  ) {
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid) {
        this.db.readDocument<User>('users', currentUserUid).subscribe(async currentUserData => {
          this.inboxMessage.senderId = currentUserData!.uid;
          this.inboxMessage.senderName = currentUserData!?.name;
        })
      }
    });
  }

  ngOnInit(): void { }

  addFriend() {
    this.db.readDocument<NameMapper>('shortNames', this.id.value).pipe(take(1)).subscribe( async map => {
      console.log(map?.id)
      this.inboxMessage.receiverId = map!?.id;
      this.db.pushIntoInbox(this.inboxMessage);
    })
    this.dialogRef.close()
  }

}
