/*
  #################### Database elements ####################
 */
  export interface Product {
    id: any;
    name: string;
    extendedName: string;
    description: string;
    price: number;
    priceWithoutTax: number;
    brand: string;
    imageUrl: string;
    category: 'headphones' | 'laptops' | 'furniture' | 'sports' | 'phones' | 'games' | 'clothing' | '';
    discount: number;
  }
  
  export interface User {
    name: string;
    email: string;
    uid: string;
    password: string;
    profile: 'admin' | 'regular';
    shoppingCart: string[];
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
  