import {Component, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {FriendInfo, User} from "../../models/interfaces";
import {databaseService} from "../../services/database.service";
import { AddFriendComponent } from "src/app/components/add-friend/add-friend.component";

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  
  friendsNames: FriendInfo[];

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private db: databaseService,
  ) { 
    this.friendsNames = [];
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          this.friendsNames = currentUserData!?.friendList;
        })
      }
    });
  }

  ngOnInit(): void { }

  addFriendDialog() {
    const dialogRef = this.dialog.open(AddFriendComponent, {
      /* width: '60%' */
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

}
