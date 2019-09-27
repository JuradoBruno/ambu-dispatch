import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentsStateService, ComponentStateActions } from '../core/services/components-state.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';
import { IStoreState } from '../shared/interfaces/store-state.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  subs = new SubSink()
  showSignin = false
  showSignup = false
  
  showSignin$: Observable<boolean>

  constructor(private componentsStateService: ComponentsStateService) { }

  ngOnInit() {
    this.observeSigninAndSignupState()
  }

  observeSigninAndSignupState() {    
    this.subs.sink = this.componentsStateService.stateChanged.subscribe((state: IStoreState) => {
      this.showSignin = state.showSigninComponent
      this.showSignup = state.showSignupComponent
    })
  }

  openSignin() {
    this.componentsStateService.changeComponentState(ComponentStateActions.OpenSigninComponent)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}