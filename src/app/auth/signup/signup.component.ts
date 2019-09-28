import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationService } from '../../core/services/validation.service';
import { IUserSigninData } from 'src/app/shared/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/modal/modal.service';
import { ComponentsStateService, ComponentStateActions } from 'src/app/core/services/components-state.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SubSink } from 'subsink';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';

@Component({
  selector: 'bj-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [
    trigger('fade', 
    [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
        'pointer-events': 'none'
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('400ms ease-in'))
    ]
    )
  ]
})
export class SignupComponent implements OnInit {
  subs = new SubSink()
  show = false
  signupForm: FormGroup;
  errorMessage: string;
  showDimmedBackground: boolean;

  get stateName() {
    return this.show ? 'show' : 'hide'
  }

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private modal: ModalService,
    private componentStateService: ComponentsStateService,
    private router: Router,
    private componentsStateService: ComponentsStateService
  ) {
  }

  ngOnInit() {
    this.buildSignupForm()
    this.observeSelf()
  }

  observeSelf() {
    this.subs.sink = this.componentsStateService.globalStateChanged.subscribe((state: IStoreState) => {
      console.log("TCL: SignupComponent -> observeSelf -> state.showSigninComponent", state.showSigninComponent)
      this.show = state.showSignupComponent
      this.showDimmedBackground = !state.showSigninComponent // Signin already has one
    })
  }

  buildSignupForm() {
    let date = Date.now()
    this.signupForm = this.formBuilder.group({
      username: [`Bruno${date}`, [Validators.required, Validators.minLength(3)]],
      password: ['Bruno2606!', [Validators.required, ValidationService.passwordValidator]],
      passwordControl: ['Bruno2606!', [Validators.required, ValidationService.passwordValidator]],
      email: ['jurado.bruno@gmail.com', [Validators.required, ValidationService.emailValidator]],
    })
  }

  signup() {
    if (!this.signupForm.valid) {
      this.showFormError('Le formulaire n\'est pas correct')
      return
    }
    let { username, password, email } = this.signupForm.value
    this.authService.signup({ username, password, email }).then(itWorked => {
      this.closeSelf()
      this.router.navigate(['/home'])
    }).catch(error => {
      this.showFormError(error.error.message)
    })
  }

  showFormError(body) {
    this.modal.show({
      header: 'Erreur',
      body: body,
      cancelButtonVisible: false
    })
  }

  closeSelf() {
    this.componentStateService.changeComponentState(ComponentStateActions.CloseSignupComponent)
  }
}
