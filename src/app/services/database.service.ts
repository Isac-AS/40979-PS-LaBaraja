import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { take } from "rxjs";
import { FriendInfo, InboxInfo, User } from "../models/interfaces";
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

  createDocument<T>(data: T, path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).set(data);
  }

  readDocument<T>(path: string, id: string) {
    const collection = this.db.collection<T>(path);
    return collection.doc(id).valueChanges();
  }

  updateDocument<T>(data:any, path: string, id: string) {
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

  addFriend(data: InboxInfo): void {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async potentialFriendData => {
      data.receiverName = potentialFriendData!?.name;
      potentialFriendData!.inbox.push(data);
      this.updateDocument<User>(potentialFriendData, 'users', data.receiverId);
    });
  }

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

  rejectFriendRequest(data: InboxInfo) {
    this.readDocument<User>('users', data.receiverId).pipe(take(1)).subscribe(async receiverData => {
      receiverData!.inbox = this.utils.RemoveElementFromInbox(receiverData!.inbox, data);
      this.updateDocument<User>(receiverData, 'users', data.receiverId);
    });
  }

  generateFriendInfo(data: InboxInfo) : any {
    let receiverFriendInfo: FriendInfo = {
      name: data.receiverName,
      id: data.receiverId
    }
    let senderFriendInfo: FriendInfo = {
      name: data.senderName,
      id: data.senderId
    }
    return {receiver: receiverFriendInfo, sender: senderFriendInfo}
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

}
