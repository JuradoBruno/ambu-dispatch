import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentsStateService, ComponentStateActions } from '../core/services/components-state.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  subs = new SubSink()
  showSignin = false
  showSignup = false

  constructor(private componentsStateService: ComponentsStateService) { }

  ngOnInit() {
    this.observeSignin()
    this.observeSignup()
  }

  observeSignin() {
    this.subs.sink = this.componentsStateService.getComponentState('signin').subscribe(value => {
      console.log("TCL: AuthComponent -> observeSignin -> value", value)
      this.showSignin = value
    })
  }

  observeSignup() {
    this.subs.sink = this.componentsStateService.getComponentState('signup').subscribe(value => {
      this.showSignup = value
    })
  }

  openSignin() {
    this.componentsStateService.changeComponentState(ComponentStateActions.OpenSigninComponent)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}