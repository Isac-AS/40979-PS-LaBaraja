import { Router} from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService} from "../../services/auth.service";
import { CustomUtilsService} from "../../services/customUtils.service";

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
    alt_password : ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authFirebase: AuthService,
    private utils: CustomUtilsService
  ) { }

  ngOnInit(): void { }

  async onSubmit() {
    const res = await this.authFirebase.login(this.newUser.value.email,
                                              this.newUser.value.password)
      .catch( error => {
        this.utils.openMessageDialog( {
          message: 'Error: Nombre de usuario o contraseña incorrectos',
          status: false
        })
      });
    if (res) {
      await this.utils.openMessageDialog( {
        message: 'Bienvenido!',
        status: true
      })
      await this.router.navigate(['/home']);
    }
  }

  clearForm(){
    this.newUser.setValue({
      email: '',
      password: '',
    })
  }

}