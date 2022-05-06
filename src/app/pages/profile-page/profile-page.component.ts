import {Observable} from "rxjs";
import {User} from "../../models/interfaces";
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {databaseService} from "../../services/database.service";
import {CustomUtilsService} from "../../services/customUtils.service";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  uid: string = '';
  path: string = 'users';

  observable: Observable<any> | undefined;

  currentUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    }
  );

  databaseElement: User = {
    name: '',
    email: '',
    uid: '',
    password: '',
    profile: 'regular',
    friendList: [],
    inbox: [],
    lobby: '',
    shortNameId: '',
    isOwner: false

  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public database: databaseService,
    private utils: CustomUtilsService
  ) {
    const currentUserIdPromise = this.auth.getUid();
    currentUserIdPromise.then(async currentUserId => {
        if (currentUserId) {
          this.uid = currentUserId;
          this.path = 'users';
          this.observable = this.database.readDocument<User>(this.path, this.uid);
          this.observable.subscribe(async res => {
              this.databaseElement = await res;
              this.initializeForm(res);
            }
          );
        }
      }
    )
  }

  ngOnInit(): void {
  }

  initializeForm(user: User) {
    this.currentUserForm.setValue(
      {
        name: user.name,
        email: user.email,
        password: user.password
      }
    )
  }

  onSubmit() {
    this.databaseElement.name = this.currentUserForm.value.name;
    this.databaseElement.email = this.currentUserForm.value.email;
    this.databaseElement.password = this.currentUserForm.value.password;
    this.update()
  }

  update() {
    const data = this.databaseElement;
    data.uid = this.uid;
    this.database.updateDocument<User>(data, this.path, data.uid).then(async (_) => {
      await this.utils.openMessageDialog({
        message: 'Producto Modificado con éxito!',
        status: true
      })
    });
  }

  clearForm() {
    this.currentUserForm.setValue(
      {
        name: '',
        email: '',
        password: ''
      }
    )
  }
}
