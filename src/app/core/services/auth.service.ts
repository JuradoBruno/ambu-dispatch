import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { IUserSigninData, ISigninDto, IUserSignupData } from 'src/app/shared/interfaces';
import { Observable } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { BaseHttpService } from './base-http.service';
import { User } from 'src/app/models/User.model';
import { UserStore } from '../stores/user.store';
import { environment } from 'src/environments/environment';
import { BuildingsStore } from '../stores/buildings.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  
  baseUrl = environment.baseUrl // Get that from .env
  // baseUrl = 'https://ambu-dispatch-production.eu-west-1.elasticbeanstalk.com/' // Get that from .env
  authUrl = this.baseUrl + 'auth'
  isAuthenticated = false;
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(
    private http: HttpClient,
    private baseHttpService: BaseHttpService,
    private userStore: UserStore,
  ) {
    console.log("TCL: AuthService -> baseUrl", this.baseUrl)

  }

  getUsername() {
    let username = localStorage.getItem('username')
    if (!username) return ''
    return username
  }

  saveUsername(username: string) {
    // TODO: SAVE IN THE STATE
    localStorage.setItem('username', username)
  }

  signin(userData: IUserSigninData): Promise<boolean> {
    console.log("TCL: AuthService -> this.authUrl", this.authUrl)
    return this.http.post<any>(this.authUrl + '/signin', userData).toPromise().then((response: ISigninDto) => {
      if (!response.accessToken) return false // Wrong data incoming
      this.baseHttpService.saveToken(response.accessToken)
      let user = new User(response.user)
      this.userStore.storeCurrentUser(user)
      return true
    }).catch(error => {
      
      if (error.status == 401) return false
      console.error(error)
    })
  }

  signup(userData: IUserSignupData): Promise<boolean> {
    return this.http.post<any>(this.authUrl + '/signup', userData).toPromise()
  }

  signout() {
    localStorage.removeItem('accessToken')
  }


  // POST with header EXAMPLE!
  // @@@@@@@@@@@@
  getUserTasks():Promise<boolean> {
    let headers = this.baseHttpService.returnHeaders()
    return this.http.post<any>(this.authUrl + '/test', {}, {headers}).toPromise().then(tasks => {
      return tasks
    }).catch(error => {
    })
  }
  // @@@@@@@@@@@@

  private handleError(error: HttpErrorResponse) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return Observable.throw(error || 'Server error');
  }

  checkIfUserIsSignedIn() {
    let token = this.baseHttpService.getTokenFromStorage()
    
    return token? true : false
  }
}

export enum UserActions {
  InitState = '[AUTH] Initialize Auth state',

  StoreCurrentUser = '[AUTH] Store current USER'    
}

export interface IAuthStore {
  user: User,
}