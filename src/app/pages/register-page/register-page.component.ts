import {Router} from "@angular/router";
import {User} from "../../models/interfaces";
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {databaseService} from "../../services/database.service";
import {CustomUtilsService} from "../../services/customUtils.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm = this.fb.group({
    name : ['', [Validators.required, Validators.minLength(2)]],
    email : ['', [Validators.required, Validators.email]],
    password : [ '', [Validators.required, Validators.minLength(6)]]
  });

  userData: User = {
    name: '',
    email: '',
    uid: '',
    password: '',
    profile: "regular",
    shoppingCart: ['']
  };

  path: string = 'users';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private db: databaseService,
    private utils: CustomUtilsService
  ) { }

  ngOnInit(): void {
  }

  async register() {
    this.userData.name = this.registerForm.value.name;
    this.userData.email = this.registerForm.value.email;
    this.userData.password = this.registerForm.value.password;

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
      this.userData.password = 'null';
      await this.db.createDocument(this.userData, this.path, this.userData.uid);
      await this.router.navigate(['/home'])
    }
  }

  clearForm(){
    this.registerForm.setValue({
      name: '',
      email: '',
      password: '',
    })
  }
}
