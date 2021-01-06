import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GetUserDetailsResponse } from '../models/get-user-details.response';
import { OperationResult } from '../models/operation-result';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UserDetailsResolver implements Resolve<OperationResult<GetUserDetailsResponse>> {
  constructor(private authService: AuthService,
    private userService: UserService) {
  }

  resolve(): Observable<OperationResult<GetUserDetailsResponse>> {
    if (this.authService.isLoggedIn()) {
      return this.userService.getUserDetails();
    }
  }
}
