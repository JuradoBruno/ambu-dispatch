import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/modal/modal.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Router } from '@angular/router';
import { IUserSigninData } from 'src/app/shared/interfaces';
import { take } from 'rxjs/operators';
import { ComponentsStateService, ComponentStateActions } from 'src/app/core/services/components-state.service';

@Component({
  selector: 'bj-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private modal: ModalService,
              private router: Router,
              private componentStateService: ComponentsStateService
              ) {
              }

  ngOnInit() {
    this.buildSigninForm()
  }

  
  buildSigninForm() {
    this.signinForm = this.formBuilder.group({
      username: ['User3', [ Validators.required, Validators.minLength(3)]],
      password: ['Bruno2605!', [ Validators.required, ValidationService.passwordValidator]]
    }) 
  }

  openSignupForm() {
    this.componentStateService.changeComponentState(ComponentStateActions.OpenSignupComponent)
  }
  
  signin() {
    if (!this.signinForm.valid) { 
      this.showFormError()
      return
    }
    
    let userData: IUserSigninData = {
      username: this.signinForm.value.username,
      password: this.signinForm.value.password
    }

    this.authService.signin(userData).pipe(take(1)).subscribe((status: boolean) => {
      if (status) {
        // Display Success
        this.componentStateService.changeComponentState(ComponentStateActions.CloseSignupComponent)
        this.router.navigate(['/home'])
      } else {
        console.log('Unable to login')
      }
    })
  }

  showFormError() {
    this.modal.show({
      header: 'Erreur',
      body: 'Le formulaire n\'est pas correct',
      cancelButtonVisible: false
    })
  }

  closeSelf() {
    this.componentStateService.changeComponentState(ComponentStateActions.CloseSigninComponent)
  }

}
