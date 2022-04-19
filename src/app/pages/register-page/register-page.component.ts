import { Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CustomUtilsService } from "../../services/customUtils.service";
import { group } from "console";
import { ErrorStateMatcher } from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})

export class RegisterPageComponent implements OnInit {

  matcher = new ErrorStateMatcher();

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('alt_password')?.value;
    console.log(pass);
    console.log(confirmPass);
    return pass === confirmPass ? null : {notSame: true}
  }

  newUser = this.fb.group({
    email : ['', [Validators.required, Validators.email]],
    username : [ '', [Validators.required, Validators.minLength(6)]],
    password : ['', [Validators.required, Validators.minLength(6)]],
    alt_password : ['', [Validators.required]]
  }, { validators: this.checkPasswords });

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