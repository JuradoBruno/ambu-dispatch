import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from '../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ AuthRoutingModule.components],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
