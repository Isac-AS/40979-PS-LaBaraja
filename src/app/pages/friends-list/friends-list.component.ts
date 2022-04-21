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
  observable: Observable<any> | unknown;


  constructor(
    private router: Router,
    private auth: AuthService,
    private db: databaseService,
    private utils: CustomUtilsService
  ) { 
    
  }

  ngOnInit(): void {
    
  }

}
