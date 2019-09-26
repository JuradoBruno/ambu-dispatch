import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationService } from '../../core/services/validation.service';
import { IUserSigninData } from 'src/app/shared/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/modal/modal.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private modal: ModalService
              ) {
              }

  ngOnInit() {
    this.buildSignupForm()
  }

  buildSignupForm() {
    this.signupForm = this.formBuilder.group({
      username: ['', [ Validators.required, Validators.minLength(3)]],
      password: ['', [ Validators.required, ValidationService.passwordValidator]],
      passwordControl: ['', [ Validators.required, ValidationService.passwordValidator]],
      email: ['', [ Validators.required, ValidationService.emailValidator]],
    }) 
  }

  signup() {
    if (!this.signupForm.valid) {
      console.log("TCL: SignupComponent -> signup -> this.modal", this.modal)
      this.modal.show({
        header: 'Erreur',
        body: 'Le formulaire n\'est pas correct',
        cancelButtonVisible: false
      })
      return
    }
    let userData: IUserSigninData = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    }
    console.log("TCL: SignupComponent -> signup -> userData", userData)
    this.authService.signup(userData)
  }
}
