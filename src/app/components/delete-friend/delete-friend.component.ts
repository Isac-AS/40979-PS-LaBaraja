import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { DeleteFriendInfo, FriendInfo } from 'src/app/models/interfaces';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-delete-friend',
  templateUrl: './delete-friend.component.html',
  styleUrls: ['./delete-friend.component.css']
})
export class DeleteFriendComponent implements OnInit {

  friend: FriendInfo;
  currentUserName: string;
  currentUserId: string;

  constructor(
    private db: databaseService,
    public dialogRef: MatDialogRef<DeleteFriendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteFriendInfo,
  ) { 
    this.friend = data.friend;
    this.currentUserName = data.currentUserName;
    this.currentUserId = data.currentUserId;
  }

  ngOnInit() {
  }

  deleteFriend() {
    this.db.removeFriend(this.friend, this.currentUserId, this.currentUserName);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
