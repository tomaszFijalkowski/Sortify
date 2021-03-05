import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { OperationResult } from '../models/responses/base/operation-result';
import { AppSettings, GetAppSettingsResponse } from '../models/responses/get-app-settings.response';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private http: HttpClient;
  private _appSettings: AppSettings;

  constructor(handler: HttpBackend,
    @Inject('BASE_URL') private baseUrl: string) {
      this.http = new HttpClient(handler);
  }

  getAppSettings(): Promise<OperationResult<GetAppSettingsResponse>> {
    return this.http.get<OperationResult<GetAppSettingsResponse>>(this.baseUrl + 'appSettings').pipe(
      map((response: OperationResult<GetAppSettingsResponse>) => {
        if (response.successful) {
          const appSettings = response.result.appSettings;
          this._appSettings = {
            loginUrl: appSettings.loginUrl,
            redirectUri: appSettings.redirectUri,
            silentRefreshRedirectUri: appSettings.silentRefreshRedirectUri,
            clientId : appSettings.clientId,
            clientScope: appSettings.clientScope,
            progressHubUrl: appSettings.progressHubUrl
          };
          return response;
        }
      }),
      catchError(() => EMPTY)).toPromise();
  }

  get appSettings(): AppSettings {
    return this._appSettings;
  }
}
