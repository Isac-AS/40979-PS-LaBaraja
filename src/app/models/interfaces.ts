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
  lobby: 'none' | string;
  shortNameId: string;
}

export interface Lobby {
  id: string;
  participants: FriendInfo[];
}

export interface NameMapper {
  id: string;
  shortNameId: string;
}

export interface Game {
  participants: Participant[],
  board: Card[],
  stack: Card[]
}

/*
  #################### Auxiliary types ####################
*/

export interface Card {
  number: number,
  type: 'Oros' | 'Copas' | 'Espadas' | 'Bastos'
}

export interface Participant {
  id: string,
  ready: boolean,
  hand: Card[]
}

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
  reason: 'AddFriend' | 'InviteToLobby';
  senderName: string;
  receiverName: string;
  senderId: string;
  receiverId: string;
  lobbyId: string;
}

export interface FriendInfo {
  name: string;
  id: string;
}

export interface DeleteFriendInfo {
  friend: FriendInfo;
  currentUserName: string;
  currentUserId: string;
}
