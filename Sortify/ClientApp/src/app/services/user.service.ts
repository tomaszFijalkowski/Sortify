import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { GetUserDetailsResponse, UserDetails } from '../models/get-user-details.response';
import { OperationResult } from '../models/operation-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetails: UserDetails;
  private cachedResponse: OperationResult<GetUserDetailsResponse>;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getUserDetails(): Observable<OperationResult<GetUserDetailsResponse>> {
    if (this.cachedResponse) {
      return of(this.cachedResponse);
    }

    return this.http.get<OperationResult<GetUserDetailsResponse>>(this.baseUrl + 'user').pipe(
      map((response: OperationResult<GetUserDetailsResponse>) => {
        if (response.successful) {
          this.userDetails = response.result.userDetails;
          this.cachedResponse = response;
        }
        return response;
      })
    );
  }

  get currentUserDetails(): UserDetails {
    return this.userDetails;
  }
}
