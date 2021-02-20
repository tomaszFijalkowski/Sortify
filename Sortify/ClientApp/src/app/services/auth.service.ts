import { AuthConfig, JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService,
    private settingsService: AppSettingsService,
    private snackBar: MatSnackBar) {
    this.configure();
  }

  private configure(): void {
    const authConfig = this.createAuthConfig();
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  private createAuthConfig(): AuthConfig {
    const appSettings = this.settingsService.appSettings;

    return {
      loginUrl: appSettings.loginUrl,
      redirectUri: appSettings.redirectUri,
      silentRefreshRedirectUri: appSettings.silentRefreshRedirectUri,
      clientId: appSettings.clientId,
      scope: appSettings.clientScope,
      strictDiscoveryDocumentValidation: false,
      responseType: `token`,
      oidc: false
    };
  }

  login(): void {
    this.oauthService.initLoginFlow(undefined, {
      show_dialog: true
    });
  }

  logout(): void {
    this.oauthService.logOut();
    this.snackBar.open('Successfully logged out');
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
