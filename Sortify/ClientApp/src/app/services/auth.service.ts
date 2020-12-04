import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService,
    private settingsService: AppSettingsService) {
    this.configure();
  }

  private configure(): void {
    const authConfig = this.createAuthConfig();
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
  }

  private createAuthConfig(): AuthConfig {
    const appSettings = this.settingsService.appSettings;

    return {
      loginUrl: appSettings.loginUrl,
      redirectUri: appSettings.redirectUri,
      clientId: appSettings.clientId,
      scope: appSettings.clientScope,
      strictDiscoveryDocumentValidation: false,
      responseType: `token`,
      oidc: false
    };
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  logoff(): void {
    this.oauthService.logOut();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
