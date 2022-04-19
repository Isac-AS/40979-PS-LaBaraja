import { Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {databaseService} from "../../services/database.service";
import { CustomUtilsService } from "../../services/customUtils.service";
import { group } from "console";
import { ErrorStateMatcher } from "@angular/material/core";
import { User } from "../../models/interfaces";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})

export class RegisterPageComponent implements OnInit {

  newUser = this.fb.group({
    email : ['', [Validators.required, Validators.email]],
    username : [ '', [Validators.required, Validators.minLength(6)]],
    password : ['', [Validators.required, Validators.minLength(6)]],
    alt_password : ['', [Validators.required]]
  });

  userData: User = {
    name: '',
    email: '',
    uid: '',
    password: '',
    profile: "regular"
  };

  path: string = 'users';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private db: databaseService,
    private utils: CustomUtilsService
  ) { }

  ngOnInit(): void { }

  async register() {

    this.userData.name = this.newUser.value.username;
    this.userData.email = this.newUser.value.email;
    this.userData.password = this.newUser.value.password;

    const res = await this.auth.register(this.userData).catch( error => {
      this.utils.openMessageDialog( {
        message: 'Error: No se puedo crear la cuenta de usuario',
        status: false
        })
    });

    if (res) {
      await this.utils.openMessageDialog( {
          message: 'Éxito en la creación de la cuenta',
          status: true
        })
        this.userData.uid = res.user!.uid;
        await this.db.createDocument(this.userData, this.path, this.userData.uid);
        await this.router.navigate(['/login']);
    }
  }

  get password(): AbstractControl {
    console.log(this.newUser.controls['password']);
    return this.newUser.controls['password'];
  }
  
  get confirm_password(): AbstractControl {
    return this.newUser.controls['alt_password'];
  }

  onPasswordChange(){
    if (this.confirm_password.value === this.password.value) {
      this.confirm_password.setErrors(null);
    } else {
      this.confirm_password.setErrors({ mismatch: true });
    }
  }

}