import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUserSigninData, ISigninDto, IUserSignupData } from 'src/app/shared/interfaces';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { User } from 'src/app/models/User.model';
import { UserStore } from '../stores/user.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // baseUrl = 'https://ambu-dispatch-production.eu-west-1.elasticbeanstalk.com/' // Get that from .env
  authUrl = 'auth'
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private baseHttp: BaseHttpService,
    private userStore: UserStore,
  ) { }

  getUsername() {
    let username = localStorage.getItem('username')
    if (!username) return ''
    return username
  }

  getUser() {
    return this.baseHttp.get<User>(this.authUrl + '/user').then((user: User) => {
      this.userStore.storeCurrentUser(user)
    })
  }

  saveUsername(username: string) {
    // TODO: SAVE IN THE STATE
    localStorage.setItem('username', username)
  }

  signin(userData: IUserSigninData): Promise<boolean> {
    return this.baseHttp.post<ISigninDto>(this.authUrl + '/signin', userData).then((response: ISigninDto) => {
      if (!response.accessToken) return false // Wrong data incoming
      this.baseHttp.saveToken(response.accessToken)
      let user = new User(response.user)
      this.userStore.storeCurrentUser(user)
      return true
    }).catch(error => {
      if (error.status == 401) return false
      console.error(error)
    })
  }

  signup(userData: IUserSignupData): Promise<boolean> {
    return this.baseHttp.post<ISigninDto>(this.authUrl + '/signup', userData).then((response: ISigninDto) => {
      if (!response.accessToken) return false // Wrong data incoming
      this.baseHttp.saveToken(response.accessToken)
      let user = new User(response.user)
      this.userStore.storeCurrentUser(user)
      return true
    })
  }

  signout() {
    localStorage.removeItem('accessToken')
  }

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
    let token = this.baseHttp.getTokenFromStorage()

    return token ? true : false
  }
}

export enum UserActions {
  InitState = '[AUTH] Initialize Auth state',

  StoreCurrentUser = '[AUTH] Store current USER'
}

export interface IAuthStore {
  user: User,
}