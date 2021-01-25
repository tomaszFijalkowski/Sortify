export interface GetAppSettingsResponse {
  appSettings: AppSettings;
}

export interface AppSettings {
  loginUrl: string;
  redirectUri: string;
  silentRefreshRedirectUri: string;
  clientId: string;
  clientScope: string;
  progressHubUrl: string;
}
