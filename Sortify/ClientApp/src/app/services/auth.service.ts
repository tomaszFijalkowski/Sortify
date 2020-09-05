import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logoff() {
    this.oauthService.logOut();
  }

  isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }
}

export const authConfig: AuthConfig = {
  loginUrl: `https://accounts.spotify.com/authorize`,
  redirectUri: `https://localhost:44362/start`,
  clientId: ``,
  scope: ``,
  strictDiscoveryDocumentValidation: false,
  responseType: `token`,
  oidc: false
};
