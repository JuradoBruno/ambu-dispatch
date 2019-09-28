import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { IUserSigninData, IAuthToken, IUserSignupData } from 'src/app/shared/interfaces';
import { Observable } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ObservableStore<IStoreState>{

  baseUrl = 'http://localhost:3000' // Get that from .env
  authUrl = this.baseUrl + '/auth'
  isAuthenticated = false;
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private baseHttpService: BaseHttpService
  ) {
    super({
      trackStateHistory: false
    })
  }

  signin(userData: IUserSigninData): Promise<boolean> {
    return this.http.post<any>(this.authUrl + '/signin', userData).toPromise().then((response: IAuthToken) => {
      if (!response.accessToken) return false // Wrong data incoming
      // this.baseHttpService.saveToken(response.accessToken)
      return true
    }).catch(error => {
      if (error.status == 401) return false
      console.error(error)
    })
  }

  signup(userData: IUserSignupData): Promise<boolean> {
    return this.http.post<any>(this.authUrl + '/signup', userData).toPromise()
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
}