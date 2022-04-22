/*
  #################### Database elements ####################
*/

export interface User {
  name: string;
  email: string;
  uid: string;
  password: string;
  profile: 'admin' | 'regular';
  friendList: FriendInfo[];
  inbox: InboxInfo[];
}


/*
  #################### Auxiliary types to pass around probably to dialogs  ####################
*/

export interface IdPair {
  id: string;
  path: string;
}

export interface HeaderDialogPair {
  login: boolean;
  admin: boolean;
}

export interface MessagePopupPair {
  message: string;
  status: boolean;
}
  
export interface InboxInfo {
  reason: 'AddFriend' | 'InviteToGame';
  senderName: string;
  receiverName: string;
  senderId: string;
  receiverId: string;
}

export interface FriendInfo {
  name: string;
  id: string;
}
