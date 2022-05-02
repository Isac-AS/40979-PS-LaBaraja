import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FriendInfo, InboxInfo, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-friends-to-lobby',
  templateUrl: './add-friends-to-lobby.component.html',
  styleUrls: ['./add-friends-to-lobby.component.css']
})
export class AddFriendsToLobbyComponent implements OnInit {

  friendList: FriendInfo[];
  inboxMessage: InboxInfo = {
    reason: 'InviteToLobby',
    senderId: '',
    receiverId: '',
    senderName: '',
    receiverName: '',
    lobbyId: '',
  };
  
  constructor(
    private auth: AuthService,
    private db: databaseService,
    public dialogRef: MatDialogRef<AddFriendsToLobbyComponent>
  ) {
    this.friendList = [];
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          this.friendList = currentUserData!?.friendList;
          this.inboxMessage.senderId = currentUserData!?.uid;
          this.inboxMessage.senderName = currentUserData!?.name;
          this.inboxMessage.lobbyId = currentUserData!?.lobby;
        })
      }
    });
   }

  ngOnInit() {}

  sendInvite(friend: FriendInfo){
    this.inboxMessage.receiverId = friend.id;
    this.inboxMessage.receiverName = friend.name;
    this.db.pushIntoInbox(this.inboxMessage);
  }
}
