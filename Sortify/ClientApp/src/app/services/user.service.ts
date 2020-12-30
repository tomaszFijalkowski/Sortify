import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { GetUserDetailsResponse } from '../models/get-user-details.response';
import { OperationResult } from '../models/operation-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getUserDetails(): Observable<OperationResult<GetUserDetailsResponse>> {
    return this.http.get<OperationResult<GetUserDetailsResponse>>(this.baseUrl + 'user');
  }
}
