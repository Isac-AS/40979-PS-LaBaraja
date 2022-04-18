import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {MessagePopupPair, Product, User} from "../../models/interfaces";
import {MatDialog} from "@angular/material/dialog";
import {databaseService} from "../../services/database.service";
import {InfoMessagePopupComponent} from "../../components/info-message-popup/info-message-popup.component";
import {AuthService} from "../../services/auth.service";
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
    shoppingCart: ['']
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public database: databaseService,
    private utils: CustomUtilsService
  ) {
    const promise = this.auth.getUid();
    promise.then(async r => {
        if (r) {
          this.uid = await r;
          this.path = 'users';
          console.log('uid -> ', this.uid)
          console.log('path -> ', this.path)
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
    this.database.updateDocument<Product>(data, this.path, data.uid).then(async (_) => {
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
