import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { IUserSigninData, IAuthToken } from 'src/app/shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:3000' // Get that from .env
  authUrl = this.baseUrl + '/auth'
  isAuthenticated = false;
  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }
  
  private userAuthChanged(status: boolean) {
    this.authChanged.emit(status); // Raise changed event
  }

  signin(userData: IUserSigninData): Observable<boolean> {    
    return this.http.post<any>( this.authUrl + '/signin', userData).pipe(
      map((authToken: IAuthToken) => {
        console.log("TCL: AuthService -> constructor -> authToken", authToken)
        localStorage.setItem('jwt', authToken.accessToken)
        this.isAuthenticated = true
        this.userAuthChanged(this.isAuthenticated);
        return this.isAuthenticated
      }),
      catchError(this.handleError)
    )
  }

  signup(userData: IUserSigninData): Observable<boolean> {
    return this.http.post<any>( this.authUrl + '/signup', userData).pipe(
      map((result: any) => {
        console.log("TCL: AuthService -> constructor -> result", result)
        return true
      }),
      catchError(this.handleError)
    )
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
