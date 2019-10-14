import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentsStateStore, ComponentStateActions } from '../core/stores/components-state.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';
import { IStoreState } from '../core/stores/store-state.interface';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { BuildingsService } from '../core/services/buildings.service';
import { MissionsService } from '../core/services/missions.service';

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
    private ComponentsStateStore: ComponentsStateStore,
    private authService: AuthService,
    private buildingsService: BuildingsService,
    private missionsService: MissionsService,
    private router: Router
    ) { }

  ngOnInit() {
    this.observeSigninAndSignupState()
    this.checkIfPlayerIsSignedId()
    this.fetchImportantData()
  }

  checkIfPlayerIsSignedId() {
    this.userIsSignedIn = this.authService.checkIfUserIsSignedIn()
  }

  observeSigninAndSignupState() {    
    this.subs.sink = this.ComponentsStateStore.stateChanged.subscribe((state: IStoreState) => {
      this.showSignin = state.showSigninComponent
      this.showSignup = state.showSignupComponent
    })
  }

  async fetchImportantData() {
    this.buildingsService.getBuildings()
    this.missionsService.getMissions()
  }

  play() {
    this.router.navigate(['/home'])
  }

  openSignin() {
    this.ComponentsStateStore.changeComponentState(ComponentStateActions.OpenSigninComponent)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}