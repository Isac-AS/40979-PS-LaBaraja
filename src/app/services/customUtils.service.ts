import { Injectable } from "@angular/core";
import { InboxInfo, MessagePopupPair } from "../models/interfaces";
import { InfoMessagePopupComponent } from "../components/info-message-popup/info-message-popup.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class CustomUtilsService {

  constructor(
    public dialog: MatDialog
  ) { }

  openMessageDialog(messagePopupPair: MessagePopupPair): void {
    const dialogRef = this.dialog.open(InfoMessagePopupComponent, {
      data: messagePopupPair
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  RemoveElementFromArray(array: InboxInfo[], element: InboxInfo): InboxInfo[] {
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

}
