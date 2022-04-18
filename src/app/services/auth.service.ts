import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {User} from "../models/interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private adminUid: string = 'adminUID';

  constructor(private authFirebase: AngularFireAuth) { }

  login(email: string, password:string) {
    return this.authFirebase.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.authFirebase.signOut();
  }

  register(data: User) {
    return this.authFirebase.createUserWithEmailAndPassword(data.email,data.password);
  }

  userState() {
    return this.authFirebase.authState;
  }

  async getUid() {
    const user = await this.authFirebase.currentUser;
    if (user) {
      return user!.uid
    } else {
      return null;
    }
  }

  async isAdmin(): Promise<boolean> {
    const currentUid = await this.getUid();
    return currentUid === this.adminUid;
  }


}
