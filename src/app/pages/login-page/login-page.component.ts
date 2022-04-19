import { Router} from "@angular/router";
import { Validators } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService} from "../../services/auth.service";
import { CustomUtilsService} from "../../services/customUtils.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  credentials = this.fb.group({
    email : ['', [Validators.required, Validators.email]],
    password : [ '', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authFirebase: AuthService,
    private utils: CustomUtilsService
  ) { }

  ngOnInit(): void { }

  async onSubmit() {
    const res = await this.authFirebase.login(this.credentials.value.email,
                                              this.credentials.value.password)
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
    this.credentials.setValue({
      email: '',
      password: '',
    })
  }

}
