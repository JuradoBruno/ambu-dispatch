import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  
  showSignin = false
  showSignup = false
  
  constructor() { }

  ngOnInit() {}

  openSignin() {
    this.showSignin = true
  }

  openSignup() {
    this.showSignup = true
  }

  closeComponent(componentToClose) {
    if (componentToClose === 'signin') {
      this.showSignin = false
    }

    if (componentToClose === 'signup') {
      this.showSignup = false
    }
  }

}
