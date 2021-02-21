import { AuthConfig, JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  invalidConfiguration = false;

  constructor(private oauthService: OAuthService,
    private settingsService: AppSettingsService,
    private snackBar: MatSnackBar,
    private router: Router) {
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

    if (appSettings) {
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
    this.invalidConfiguration = true;
  }

  login(): void {
    if (this.invalidConfiguration) {
      this.router.navigate(['/error']);
    }

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
