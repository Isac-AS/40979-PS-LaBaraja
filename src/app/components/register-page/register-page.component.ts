import { Router } from "@angular/router";
import { User } from "../../models/interfaces";
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {databaseService} from "../../services/database.service";
import { CustomUtilsService } from "../../services/customUtils.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})

export class RegisterPageComponent implements OnInit {

  errorMessage: string = "";

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
    profile: "regular",
    friendList : [],
    inbox : []
  };

  path: string = 'users';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private db: databaseService,
    private utils: CustomUtilsService,
    public dialogRef: MatDialogRef<RegisterPageComponent>
  ) { }

  ngOnInit(): void { }

  async register() {

    this.userData.name = this.newUser.value.username;
    this.userData.email = this.newUser.value.email;
    this.userData.password = this.newUser.value.password;

    const res = await this.auth.register(this.userData).catch( error => {
      switch(error.code){
        
        case "auth/email-already-in-use":
          this.errorMessage = "Error: El email introducido ya está en uso";
          break;
        
        case "auth/internal-error":
          this.errorMessage = "Error del sistema. Inténtelo de nuevo";
          break;

        default:
          this.errorMessage = "Error desconocido. Inténtelo de nuevo";
      }

      this.utils.openMessageDialog({
        message: this.errorMessage, status: false})
    });

    if (res) {
      await this.utils.openMessageDialog( {
          message: 'Éxito en la creación de la cuenta',
          status: true
        })
        this.userData.uid = res.user!.uid;
        this.userData.password = 'null';
        await this.db.createDocument(this.userData, this.path, this.userData.uid);
        this.dialogRef.close();
        await this.router.navigate(['/home']);
    }
  }

  get password(): AbstractControl {
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