import {Router} from "@angular/router";
import {User} from "../../models/interfaces";
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {databaseService} from "../../services/database.service";
import {CustomUtilsService} from "../../services/customUtils.service";
import { read } from "fs";
import { Observable } from "rxjs";

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  path: string = 'users';
  observable: Observable<any> | undefined;
  user: User = {
    name: '',
    email: '',
    uid: '',
    password: '',
    profile: 'regular',
    friendList: [''],
    inbox: ['']
  };
  friendsNames: String[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: databaseService,
    private utils: CustomUtilsService
  ) { 
    const promise = this.auth.getUid();
    promise.then(async r => {
      if (r){
        this.path = 'users';
        this.observable = this.db.readDocument<User>(this.path, await r);
        this.observable.subscribe(async res => {
          this.user = await res;
          for (let uuid of this.user.friendList) {
            const friendObservable: Observable<any> = this.db.readDocument<User>(this.path, uuid);
            friendObservable.subscribe(async result => {
              this.friendsNames.push(result.name);
            })
          }
        });
      }
    })

  }
  

  ngOnInit(): void {
  }

}
