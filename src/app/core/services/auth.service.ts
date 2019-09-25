import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { IUserSigninData } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:3000' // Get that from .env
  authUrl = this.baseUrl + '/auth'

  constructor(private http: HttpClient) { }

  signup(userData: IUserSigninData) {
    console.log("TCL: AuthService -> signup -> userData", userData)
    // Ajouter header??!!
    this.http.post('http://localhost:3000/auth/signup', userData).subscribe(data => {
      console.log("TCL: AuthService -> signup -> data", data)
    })
  }
}
