import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/modal/modal.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Router } from '@angular/router';
import { IUserSigninData } from 'src/app/shared/interfaces';
import { take } from 'rxjs/operators';
import { ComponentsStateStore, ComponentStateActions } from 'src/app/core/stores/components-state.store';
import { SubSink } from 'subsink';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'bj-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [
    trigger('fade', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('400ms ease-in'))
    ])
  ]
})
export class SigninComponent implements OnInit, OnDestroy {
  subs = new SubSink()
  show = false
  savedUsername = ''
  signinForm: FormGroup;
  errorMessage: string;

  get stateName() {
    return this.show ? 'show' : 'hide'
  }

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private modal: ModalService,
    private router: Router,
    private ComponentsStateStore: ComponentsStateStore
  ) { }

  ngOnInit() {
    this.savedUsername = this.authService.getUsername()
    this.buildSigninForm()
    this.observeSelf()
  }

  observeSelf() {
    this.subs.sink = this.ComponentsStateStore.globalStateChanged.subscribe((state: IStoreState) => {
      this.show = state.showSigninComponent
    })
  }

  buildSigninForm() {
    this.signinForm = this.formBuilder.group({
      username: [this.savedUsername, [Validators.required, Validators.minLength(3)]],
      password: ['Syncmaster2605!', [Validators.required, ValidationService.passwordValidator]]
    })
  }

  openSignupForm() {
    this.ComponentsStateStore.changeComponentState(ComponentStateActions.OpenSignupComponent)
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

    this.authService.signin(userData).then(isLoggedIn => {
      if (!isLoggedIn) {
        this.showFormError()
        return
      }
      // We are signed In
      this.authService.saveUsername(userData.username)
      this.ComponentsStateStore.changeComponentState(ComponentStateActions.CloseSigninComponent)
      this.router.navigate(['/home'])
    })
  }

  showFormError() {
    this.modal.show({
      header: 'Erreur',
      body: 'Identifiants invalides',
      cancelButtonVisible: false
    })
  }

  closeSelf() {
    this.ComponentsStateStore.changeComponentState(ComponentStateActions.CloseSigninComponent)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
