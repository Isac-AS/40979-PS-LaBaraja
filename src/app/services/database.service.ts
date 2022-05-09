import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { take } from "rxjs";
import { FriendInfo, Game, InboxInfo, Lobby, User } from "../models/interfaces";
import { CustomUtilsService } from "./customUtils.service";

@Injectable({
  providedIn: 'root'
})
export class databaseService {
  constructor(
    public db: AngularFirestore,
    private utils: CustomUtilsService
  ) {
  }

  /*
    Basic CRUD Stuff
  */
  createDocument<T>(data: T, path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).set(data);
  }

  readDocument<T>(path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).valueChanges();
  }

  updateDocument<T>(data: any, path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).update(data);
  }

  deleteDocument<T>(path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).delete();
  }

  readCollection<T>(path: string) {
    const collection = this.db.collection<T>(path);
    return collection.valueChanges();
  }

  createId() {
    return this.db.createId();
  }

  /*
    Inbox
  */
  pushIntoInbox(data: InboxInfo): void {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async potentialFriendData => {
      data.receiverName = potentialFriendData!?.name;
      potentialFriendData!.inbox.push(data);
      this.updateDocument<User>(potentialFriendData, 'users', data.receiverId);
    });
  }

  generateFriendInfo(data: InboxInfo): any {
    let receiverFriendInfo: FriendInfo = {
      name: data.receiverName,
      id: data.receiverId
    }
    let senderFriendInfo: FriendInfo = {
      name: data.senderName,
      id: data.senderId
    }
    return { receiver: receiverFriendInfo, sender: senderFriendInfo }
  }

  removeFromInbox(data: InboxInfo) {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.inbox = this.utils.RemoveElementFromInbox(receiverData!.inbox, data);
      this.updateDocument<User>(receiverData, 'users', data.receiverId);
    });
  }

  /*
    Friend handling
  */
  acceptFriendRequest(data: InboxInfo) {
    let elementFriendInfo = this.generateFriendInfo(data);

    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.friendList.push(elementFriendInfo.sender)
      receiverData!.inbox = this.utils.RemoveElementFromInbox(receiverData!.inbox, data);
      this.updateDocument<User>(receiverData, 'users', data.receiverId);
    });

    this.readDocument<User>('users', data.senderId).pipe(take(1)).subscribe(async senderData => {
      senderData!.friendList.push(elementFriendInfo.receiver)
      this.updateDocument<User>(senderData, 'users', data.senderId);
    });
  }

  removeFriend(friendInfo: FriendInfo, listOwnerId: string, listOwnerName: string) {
    this.readDocument<User>('users', listOwnerId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.friendList = this.utils.RemoveElementFromFriendList(receiverData!.friendList, friendInfo);
      this.updateDocument<User>(receiverData, 'users', listOwnerId);
    });
    let userInfo: FriendInfo = {
      name: listOwnerName,
      id: listOwnerId
    }
    this.readDocument<User>('users', friendInfo.id).pipe(take(1)).subscribe(async senderData => {
      senderData!.friendList = this.utils.RemoveElementFromFriendList(senderData!.friendList, userInfo);
      this.updateDocument<User>(senderData, 'users', friendInfo.id);
    });
  }

  /*
    Lobby handling
  */
  acceptLobbyRequest(data: InboxInfo) {
    let elementFriendInfo = this.generateFriendInfo(data);

    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.lobby = data.lobbyId;
      receiverData!.isOwner = false;
      receiverData!.inbox = this.utils.RemoveElementFromInbox(receiverData!.inbox, data);
      this.updateDocument<User>(receiverData, 'users', data.receiverId);
    });

    this.readDocument<Lobby>('lobbies', data.lobbyId).pipe(take(1)).subscribe(async lobbyData => {
      lobbyData!.participants.push(elementFriendInfo.receiver)
      this.updateDocument<User>(lobbyData, 'lobbies', data.lobbyId);
    });
  }



  removeFromLobby(data: Lobby, user: FriendInfo) {
    this.readDocument<User>('users', user.id).pipe(take(1)).subscribe(async userData => {
      userData!.lobby = 'none';
      userData!.isOwner = false;
      userData!.inGame = false;
      this.updateDocument<User>(userData, 'users', user.id);
    });

    data.participants = this.utils.RemoveElementFromFriendList(data.participants, user);
    this.updateDocument<Lobby>(data, 'lobbies', data.id);
    if (data.participants.length === 0) this.deleteDocument('lobbies', data.id);

    this.readDocument<Game>('games', data.id).pipe(take(1)).subscribe(async gameData => {
      gameData!.participants = this.utils.RemoveParticipant(gameData!.participants, { id: user.id, name: '', turn: false, hand: [] });
      if (gameData!.participants.length === 0) this.deleteDocument('games', data.id)
      else this.updateDocument<Game>(gameData, 'games', data.id)
    })
  }

  exists(id: any, path: string): boolean {
    const collection = this.db.collection(path);
    collection.doc(id).valueChanges().pipe(take(1)).subscribe(async res => {
      if (res) return true;
      else return false;
    })
    return false
  }

  /*
  Game
  */
  joinGame(data: InboxInfo) {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(userData => {
      this.readDocument<Game>('games', userData!?.lobby).pipe(take(1)).subscribe(gameData => {
        gameData?.participants.push({
          name: userData!?.name,
          id: userData!?.uid,
          turn: false,
          hand: []
        })
        this.updateDocument<Game>(gameData, 'games', userData!.lobby);
        userData!.inGame = true;
        this.updateDocument<Game>(userData, 'users', userData!.uid);
        userData!.inbox = this.utils.RemoveElementFromInbox(userData!.inbox, data);
        this.updateDocument<User>(userData, 'users', data.receiverId);
      })
    })


  }

  rejectGameInvite(data: InboxInfo) {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.inbox = this.utils.RemoveElementFromInbox(receiverData!.inbox, data);
      this.updateDocument<User>(receiverData, 'users', data.receiverId);
    });
  }

  joinGameAsOwner(data: FriendInfo) {
    this.readDocument<User>('users', data.id).pipe(take(1)).subscribe(userData => {
      this.readDocument<Game>('games', userData!?.lobby).pipe(take(1)).subscribe(gameData => {
        gameData?.participants.push({
          name: userData!?.name,
          id: userData!?.uid,
          turn: false,
          hand: []
        })
        this.updateDocument<Game>(gameData, 'games', userData!.lobby)
        userData!.inGame = true;
        this.updateDocument<Game>(userData, 'users', userData!.uid);
      })
    })
  }

  quitGame(user: User) {
    this.readDocument<Game>('games', user!?.lobby).pipe(take(1)).subscribe(gameData => {
      gameData!.participants = this.utils.RemoveParticipant(gameData!.participants, { id: user.uid, name: '', turn: false, hand: [] });
      gameData!.winners = this.utils.RemoveParticipant(gameData!.winners, { id: user.uid, name: '', turn: false, hand: [] });
      if (gameData!.participants.length == 0 && gameData!.winners.length == 0) this.deleteDocument('games', user!?.lobby)
      else this.updateDocument<Game>(gameData, 'games', user!.lobby)
    })
    user.inGame = false;
    this.updateDocument<User>(user, 'users', user.uid);
  }



}
