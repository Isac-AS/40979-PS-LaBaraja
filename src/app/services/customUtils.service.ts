import { Injectable } from "@angular/core";
import { Card, FriendInfo, Game, InboxInfo, Lobby, MessagePopupPair, Participant, User } from "../models/interfaces";
import { InfoMessagePopupComponent } from "../components/info-message-popup/info-message-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { StorageService } from "./storage.service";
import { take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomUtilsService {

  timeout: number = 0;

  constructor(
    public dialog: MatDialog,
    private storage: StorageService
  ) { }

  getCleanUser(): User {
    return {
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
    }
  }

  getCleanLobby(): Lobby {
    return {
      id: '',
      participants: []
    }
  }

  getCleanGame(): Game {
    return {
      id: '',
      participants: [],
      board: [],
      turn: 0,
      winners: [],
      hasStarted: false,
      passCounter: 0,
      lastPlayed: ''
    }
  }

  openMessageDialog(messagePopupPair: MessagePopupPair): void {
    const dialogRef = this.dialog.open(InfoMessagePopupComponent, {
      data: messagePopupPair,
      position: { top: '2%' }
    });

    dialogRef.afterOpened().subscribe(_ => {
      switch (messagePopupPair.status) {

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

  RemoveParticipant(array: Participant[], element: Participant): Participant[] {
    array.forEach((value, index) => {
      if (value.id === element.id) array.splice(index, 1);
    });
    return array;
  }

  getCompleteDeck(): Card[] {
    let deck: Card[] = [];
    for (let suit of ['oros', 'copas', 'espadas', 'bastos']) {
      for (let i = 1; i < 8; i++) {
        deck.push({ id: suit + '-' + i, number: i, suit: suit, imageUrl: 'a' })
      }
      for (let i = 10; i < 13; i++) {
        deck.push({ id: suit + '-' + i, number: i, suit: suit, imageUrl: 'b' })
      }
    }
    for (let card of deck) {
      this.storage.getRef('Cards/' + card.id + '.JPG').getDownloadURL().pipe(take(1)).subscribe( async url => {
        card.imageUrl = await url;
      })
    }
    return deck;
  }
}
