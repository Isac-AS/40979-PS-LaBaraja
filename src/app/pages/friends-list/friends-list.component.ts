import {Component, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {FriendInfo, User} from "../../models/interfaces";
import {databaseService} from "../../services/database.service";
import { AddFriendComponent } from "src/app/components/add-friend/add-friend.component";
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  
  friendList: FriendInfo[];
  currentUserId: string = '';
  currentUserName: string = '';

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
  ) { 
    this.friendList = [];
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.currentUserId = currentUserUid;
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          this.friendList = currentUserData!?.friendList;
          this.currentUserName = currentUserData!?.name;
        })
      }
    });
  }

  ngOnInit(): void { }

  addFriendDialog() {
    const dialogRef = this.dialog.open(AddFriendComponent, {
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

  deleteFriend(friend: FriendInfo, currentId: string, currentUserName: string) {
    this.db.removeFriend(friend, currentId, currentUserName);
  }

}
