import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { GetUserDetailsResponse, UserDetails } from '../models/get-user-details.response';
import { OperationResult } from '../models/operation-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetails: UserDetails;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getUserDetails(): Observable<OperationResult<GetUserDetailsResponse>> {
    return this.http.get<OperationResult<GetUserDetailsResponse>>(this.baseUrl + 'user').pipe(
      map((response: OperationResult<GetUserDetailsResponse>) => {
        this.userDetails = response.result.userDetails;
        return response;
      })
    );
  }

  get currentUserDetails(): UserDetails {
    return this.userDetails;
  }
}
