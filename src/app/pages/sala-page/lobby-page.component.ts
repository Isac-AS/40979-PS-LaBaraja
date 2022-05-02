import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeLast } from 'rxjs';
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';
import { FriendInfo, Lobby, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { databaseService } from 'src/app/services/database.service';
import { AddFriendsToLobbyComponent } from './add-friends-to-lobby/add-friends-to-lobby.component';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.css']
})
export class LobbyPageComponent implements OnInit {

  currentLobby: Lobby = {
    id: '',
    participants : []
  }

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

  onChange: boolean = true;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          console.log("aaaaa");
          if (currentUserData) this.currentUserData = currentUserData;
          if (currentUserData?.lobby != 'none') {
            this.db.readDocument<Lobby>('lobbies', currentUserData!?.lobby).subscribe( async usersLobby => {
              if(usersLobby && this.onChange) this.currentLobby = usersLobby;
              console.log(this.onChange);
              console.log(this.currentLobby.participants.length);
            })
          }
        })
      }
    });
  }

  ngOnInit(): void {
  }

  createLobby() {
    const lobby: Lobby = {
      id: this.db.createId(),
      participants: [
        {
          id: this.currentUserData.uid,
          name: this.currentUserData.name,
        }
      ]
    }
    this.db.createDocument<Lobby>(lobby, 'lobbies', lobby.id);
    this.currentUserData.lobby = lobby.id
    this.db.updateDocument<User>(this.currentUserData, 'users', this.currentUserData.uid)
  }

  quitLobby() {
    this.db.removeFromLobby(this.currentLobby, {id: this.currentUserData.uid, name: this.currentUserData.name});
    this.clearCurrentLobby();
    this.onChange = false;
  }

  removeFromLobby(friend: FriendInfo) {
    this.db.removeFromLobby(this.currentLobby, friend);
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

  clearCurrentLobby() {
    this.currentLobby = {
      id: '',
      participants : []
    }
  }
  
}