import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/modal/modal.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'bj-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  @Output() closeComponent = new EventEmitter<string>();
  @Output() openSignup = new EventEmitter()
  signinForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private modal: ModalService
              ) {
              }

  ngOnInit() {
    this.buildSigninForm()
  }

  buildSigninForm() {
    this.signinForm = this.formBuilder.group({
      username: ['', [ Validators.required, Validators.minLength(3)]],
      password: ['', [ Validators.required, ValidationService.passwordValidator]]
    }) 
  }

  signin() {

  }

}
