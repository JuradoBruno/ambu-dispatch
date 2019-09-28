import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentsStateService, ComponentStateActions } from '../core/services/components-state.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';
import { IStoreState } from '../shared/interfaces/store-state.interface';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  subs = new SubSink()
  showSignin = false
  showSignup = false
  userIsSignedIn = false
  
  showSignin$: Observable<boolean>

  constructor(
    private componentsStateService: ComponentsStateService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.observeSigninAndSignupState()
    this.checkIfPlayerIsSignedId()
  }

  checkIfPlayerIsSignedId() {
    this.userIsSignedIn = this.authService.checkIfUserIsSignedIn()
  }

  observeSigninAndSignupState() {    
    this.subs.sink = this.componentsStateService.stateChanged.subscribe((state: IStoreState) => {
      this.showSignin = state.showSigninComponent
      this.showSignup = state.showSignupComponent
    })
  }

  getUserTasks() {
    this.authService.getUserTasks()
  }

  play() {
    this.router.navigate(['/home'])
  }

  openSignin() {
    this.componentsStateService.changeComponentState(ComponentStateActions.OpenSigninComponent)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}