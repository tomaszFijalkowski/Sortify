import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetUserDetailsResponse, UserDetails } from '../models/responses/get-user-details.response';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetails: UserDetails;
  private cachedResponse: OperationResult<GetUserDetailsResponse>;

  constructor(private http: HttpClient,
    private loadingService: LoadingService,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getUserDetails(affectLoading = true): Observable<OperationResult<GetUserDetailsResponse>> {
    if (this.cachedResponse) {
      return of(this.cachedResponse);
    }

    if (affectLoading) {
      this.loadingService.startLoading();
    }

    return this.http.get<OperationResult<GetUserDetailsResponse>>(this.baseUrl + 'user').pipe(
      map((response: OperationResult<GetUserDetailsResponse>) => {
        if (affectLoading) {
          this.loadingService.finishLoading();
        }

        if (response.successful) {
          this.userDetails = response.result.userDetails;
          this.cachedResponse = response;
        }
        return response;
      })
    );
  }

  clearCache(): void {
    this.userDetails = undefined;
    this.cachedResponse = undefined;
  }

  get currentUserDetails(): UserDetails {
    return this.userDetails;
  }
}
