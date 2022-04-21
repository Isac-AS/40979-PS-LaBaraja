/*
  #################### Database elements ####################
 */
  
  export interface User {
    name: string;
    email: string;
    uid: string;
    password: string;
    profile: 'admin' | 'regular';
    friendList: string[];
    inbox: any[];
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
  