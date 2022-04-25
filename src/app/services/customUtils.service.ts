import { Injectable } from "@angular/core";
import { FriendInfo, InboxInfo, MessagePopupPair } from "../models/interfaces";
import { InfoMessagePopupComponent } from "../components/info-message-popup/info-message-popup.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class CustomUtilsService {

  timeout: number = 0;

  constructor(
    public dialog: MatDialog
  ) { }

  openMessageDialog(messagePopupPair: MessagePopupPair): void {
    const dialogRef = this.dialog.open(InfoMessagePopupComponent, {
      data: messagePopupPair,
      position: {top: '2%'}
    });

    dialogRef.afterOpened().subscribe(_ => {
      switch (messagePopupPair.status){

        case false:
          this.timeout = 6000;
          break;
        
        case true:
          this.timeout = 2500;
          break;
        
        default:
          this.timeout = 3000;
      }
      setTimeout(() => {
         dialogRef.close();
      }, this.timeout)
    });

    dialogRef.afterClosed().subscribe(res => {
    });
  }

  RemoveElementFromInbox(array: InboxInfo[], element: InboxInfo): InboxInfo[] {
    array.forEach((value, index) => {
      if (value.reason === element.reason &&
          value.senderId === element.senderId &&
          value.receiverId === element.receiverId &&
          value.senderName === element.senderName && 
          value.receiverName === element.receiverName
          ) {
        array.splice(index, 1);
      } 
    });
    return array;
  }

  RemoveElementFromFriendList(array: FriendInfo[], element: FriendInfo): FriendInfo[] {
    array.forEach((value, index) => {
      if (value.id === element.id &&
          value.name === element.name 
          ) {
        array.splice(index, 1);
      } 
    });
    return array;
  }

}
