import { Injectable } from "@angular/core";
import { Card, FriendInfo, Game, InboxInfo, Lobby, MessagePopupPair, Participant, User } from "../models/interfaces";
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
      stack: [],
      turn: 0
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
        deck.push({ id: suit + '-' + i, number: i, suit: suit })
      }
      for (let i = 10; i < 13; i++) {
        deck.push({ id: suit + '-' + i, number: i, suit: suit })
      }
    }
    return deck;
  }

  shuffle(deck: Card[]): Card[] {
    for (let i = 0; i < 1000; i++) {
      let location1 = Math.floor((Math.random() * deck.length));
      let location2 = Math.floor((Math.random() * deck.length));
      let tmp = deck[location1];

      deck[location1] = deck[location2];
      deck[location2] = tmp;
    }
    return deck;
  }

  /* // Alternative algorithm
  dealCards(deck: Card[]) {
    console.log('Deck -> ', deck)
    let player = 0;
    while (deck.length > 0) {
      let randomCardIndex = Math.floor(Math.random() * (deck.length));
      let randomCard = deck.splice(randomCardIndex, 1)[0];
      this.game.participants[player].hand.push(randomCard);
      ++player;
      if (player >= this.game.participants.length) player = 0;
      console.log(this.game.participants[player].hand)
    }
    console.log(this.game)
  }
  */
}
