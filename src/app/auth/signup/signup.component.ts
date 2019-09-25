import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUserSigninData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {}
  
  signup() {
    let userData: IUserSigninData = {
      username: 'bruno1994',
      password: 'Bruno123456!'
    }
    console.log("TCL: SignupComponent -> signup -> userData", userData)
    this.authService.signup(userData)
  }
}
