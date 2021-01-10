import { OAuthModule } from 'angular-oauth2-oidc';
import { SortablejsModule } from 'ngx-sortablejs';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StartComponent } from './components/start/start.component';
import { CreateStepperComponent } from './components/stepper/create-stepper/create-stepper.component';
import { CreationStepComponent } from './components/stepper/steps/creation-step/creation-step.component';
import { EndStepComponent } from './components/stepper/steps/end-step/end-step.component';
import { SelectionStepComponent } from './components/stepper/steps/selection-step/selection-step.component';
import { SortingStepComponent } from './components/stepper/steps/sorting-step/sorting-step.component';
import { PlaylistResolver } from './resolvers/playlist.resolver';
import { AppSettingsService } from './services/app-settings.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { ConfirmationGuardService } from './services/guards/confirmation-guard.service';
import { AuthInterceptor } from './services/interceptors/auth-interceptor.service';
import { ErrorInterceptor } from './services/interceptors/error-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingPageComponent,
    StartComponent,
    CreateStepperComponent,
    SelectionStepComponent,
    SortingStepComponent,
    CreationStepComponent,
    EndStepComponent,
    NotFoundComponent,
    FooterComponent
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
    FontAwesomeModule,
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
    ConfirmationGuardService,
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
