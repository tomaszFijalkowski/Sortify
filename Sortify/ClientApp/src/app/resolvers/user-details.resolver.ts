import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetUserDetailsResponse } from '../models/responses/get-user-details.response';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UserDetailsResolver implements Resolve<OperationResult<GetUserDetailsResponse>> {
  constructor(private authService: AuthService,
    private userService: UserService,
    private router: Router) {
  }

  resolve(): Observable<OperationResult<GetUserDetailsResponse>> {
    if (this.authService.isLoggedIn()) {
      return this.userService.getUserDetails().pipe(
        map((response: OperationResult<GetUserDetailsResponse>) => {
          if (response.successful) {
            return response;
          }
          this.router.navigate(['/error'], { state: { statusCode: response.statusCode, errorMessage: response.errorMessage } });
        }),
        catchError(() => {
          this.router.navigate(['/error']);
          return EMPTY;
        }));
    }
  }
}
