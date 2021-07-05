import { OAuthModule } from 'angular-oauth2-oidc';
import { SortablejsModule } from 'ngx-sortablejs';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { FooterIconComponent } from './components/footer/footer-icon/footer-icon.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { VideoPreviewComponent } from './components/landing-page/video-preview/video-preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { StartComponent } from './components/start/start.component';
import { TimeoutWarningComponent } from './components/stepper/base-stepper/timeout-warning/timeout-warning.component';
import { CreateStepperComponent } from './components/stepper/create-stepper/create-stepper.component';
import {
    SortConfirmationComponent
} from './components/stepper/sort-stepper/sort-confirmation/sort-confirmation.component';
import { SortStepperComponent } from './components/stepper/sort-stepper/sort-stepper.component';
import { CreationStepComponent } from './components/stepper/steps/creation-step/creation-step.component';
import {
    SmartSplitHelpComponent
} from './components/stepper/steps/creation-step/smart-split-help/smart-split-help.component';
import { EndStepComponent } from './components/stepper/steps/end-step/end-step.component';
import { SelectionStepComponent } from './components/stepper/steps/selection-step/selection-step.component';
import {
    AudioFeaturesHelpComponent
} from './components/stepper/steps/sorting-step/audio-features-help/audio-features-help.component';
import { SortByHelpComponent } from './components/stepper/steps/sorting-step/sort-by-help/sort-by-help.component';
import { SortingStepComponent } from './components/stepper/steps/sorting-step/sorting-step.component';
import { KeyboardClickDirective } from './directives/keyboard-click.directive';
import { PlaylistsToCreateResolver } from './resolvers/playlists-to-create.resolver';
import { PlaylistsToSortResolver } from './resolvers/playlists-to-sort.resolver';
import { UserDetailsResolver } from './resolvers/user-details.resolver';
import { AppSettingsService } from './services/app-settings.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { ConfirmationGuardService } from './services/guards/confirmation-guard.service';
import { AuthInterceptor } from './services/interceptors/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingPageComponent,
    StartComponent,
    SortStepperComponent,
    SortConfirmationComponent,
    CreateStepperComponent,
    TimeoutWarningComponent,
    SelectionStepComponent,
    SortingStepComponent,
    AudioFeaturesHelpComponent,
    SortByHelpComponent,
    CreationStepComponent,
    SmartSplitHelpComponent,
    EndStepComponent,
    ErrorPageComponent,
    NotFoundComponent,
    AboutComponent,
    PrivacyComponent,
    FooterComponent,
    FooterIconComponent,
    VideoPreviewComponent,
    ProgressSpinnerComponent,
    KeyboardClickDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatGridListModule,
    MatRippleModule,
    FontAwesomeModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    SortablejsModule.forRoot({
      animation: 150,
      ghostClass: 'ghost-chip'
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
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { verticalPosition: 'top', duration: 2500 }
    },
    AuthService,
    AuthGuardService,
    ConfirmationGuardService,
    PlaylistsToCreateResolver,
    PlaylistsToSortResolver,
    UserDetailsResolver
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

export function loadAppSettings(appSettingsService: AppSettingsService) {
  return () => appSettingsService.getAppSettings();
}
