import {Component, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {DeleteFriendInfo, FriendInfo, User} from "../../models/interfaces";
import {databaseService} from "../../services/database.service";
import { AddFriendComponent } from "src/app/components/add-friend/add-friend.component";
import { NotificationDialogComponent } from 'src/app/components/notification-Dialog/notification-Dialog.component';
import { DeleteFriendComponent } from 'src/app/components/delete-friend/delete-friend.component';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  
  friendList: FriendInfo[];
  currentUserFriendIdentifier: string = '';
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
          this.currentUserFriendIdentifier = currentUserData!.shortNameId;
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

  deleteFriendDialog(friend: FriendInfo, currentUserId: string, currentUserName: string) {
    let deleteFriendInfo: DeleteFriendInfo = {
        friend:friend,
        currentUserName: currentUserName,
        currentUserId: currentUserId
    }
    const dialogRef = this.dialog.open(DeleteFriendComponent, {
      data: deleteFriendInfo
    });
    dialogRef.afterClosed().subscribe(res => {});
  }
}
