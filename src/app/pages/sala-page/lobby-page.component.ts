import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, takeLast } from 'rxjs';
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';
import { FriendInfo, Game, InboxInfo, Lobby, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CustomUtilsService } from 'src/app/services/customUtils.service';
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
    shortNameId: '',
    isOwner: false,
    inGame: false,
  };

  onChange: boolean = true;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
    private changeDetection: ChangeDetectorRef,
    private utils: CustomUtilsService,
    private router: Router
  ) {
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          if (currentUserData) {
            this.currentUserData = currentUserData;
          }
          if (currentUserData?.lobby != 'none') {
            this.db.readDocument<Lobby>('lobbies', currentUserData!?.lobby).subscribe( async usersLobby => {
              if(usersLobby) this.currentLobby = usersLobby;
            })
          }
          else {
            this.clearCurrentLobby();
            this.changeDetection.detectChanges();
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
    this.currentUserData.lobby = lobby.id;
    this.currentUserData.isOwner = true;
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

  startGame() {
    for (let player of this.currentLobby.participants) {
      if (player.id != this.currentUserData.uid) {
        let inboxInfo: InboxInfo = {
          reason: 'StartGame',
          senderId: this.currentUserData.uid,
          senderName: this.currentUserData.name,
          receiverId: player.id,
          receiverName: player.name,
          lobbyId: this.currentLobby.id
        }
        this.db.pushIntoInbox(inboxInfo)
      }
    }
    this.createGame()
    this.db.joinGameAsOwner({ id: this.currentUserData.uid, name: this.currentUserData.name})
    this.router.navigate(['/board']);
  }

  createGame(): Game {
    let game : Game =  this.utils.getCleanGame();
    game.id = this.currentLobby.id;
    this.db.createDocument<Game>(game, 'games', game.id)
    return game;
  }
  
}