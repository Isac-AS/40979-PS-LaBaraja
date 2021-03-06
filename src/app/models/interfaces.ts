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
  isOwner: boolean;
  inGame: boolean;
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
  id: string;
  participants: Participant[],
  board: Card[],
  turn: number,
  winners: Participant[],
  hasStarted: boolean,
  passCounter: number,
  lastPlayed: string
}

/*
  #################### Auxiliary types ####################
*/

export interface Card {
  id: string
  number: number,
  suit: string, 
  imageUrl: string
}

export interface Participant {
  name: string,
  id: string,
  turn: boolean,
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
  reason: 'AddFriend' | 'InviteToLobby' | 'StartGame';
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

export interface InGameCardDialogs {
  userAsAParticipant: Participant,
  game: Game,
}
