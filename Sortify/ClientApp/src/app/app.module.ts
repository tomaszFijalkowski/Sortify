import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './helpers/auth-guard.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StartComponent } from './components/start/start.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { MatTableModule } from '@angular/material/table';
import { PlaylistResolver } from './resolvers/playlist.resolver';
import { AuthInterceptor } from './services/interceptors/auth-interceptor.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { SortablejsModule } from 'ngx-sortablejs';
import { ErrorInterceptor } from './services/interceptors/error-interceptor.service';
import { AppSettingsService } from './services/app-settings.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
    StepperComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatGridListModule,
    MatRippleModule,
    SortablejsModule.forRoot({
      animation: 150,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadAppSettings,
      deps: [AppSettingsService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    AuthGuardService,
    PlaylistResolver
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

export function loadAppSettings(appSettingsService: AppSettingsService) {
  return () => appSettingsService.getAppSettings();
}
