export interface GetAppSettingsResponse {
  appSettings: AppSettings;
}

export interface AppSettings {
  loginUrl: string;
  redirectUri: string;
  clientId: string;
  clientScope: string;
}
