import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { AppSettings, GetAppSettingsResponse } from '../models/get-app-settings.response';
import { OperationResult } from '../models/operation-result';

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

  getAppSettings() {
    return this.http.get<OperationResult<GetAppSettingsResponse>>(this.baseUrl + 'appSettings')
      .toPromise()
      .then(response => {
        const appSettings = response.result.appSettings;
        this._appSettings = {
          loginUrl: appSettings.loginUrl,
          redirectUri: appSettings.redirectUri,
          silentRefreshRedirectUri: appSettings.silentRefreshRedirectUri,
          clientId : appSettings.clientId,
          clientScope: appSettings.clientScope,
          progressHubUrl: appSettings.progressHubUrl
        };
    });
  }

  get appSettings(): AppSettings {
    return this._appSettings;
  }
}
