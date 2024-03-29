import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { CreateStepperComponent } from './components/stepper/create-stepper/create-stepper.component';
import { SortStepperComponent } from './components/stepper/sort-stepper/sort-stepper.component';
import { PlaylistsToCreateResolver } from './resolvers/playlists-to-create.resolver';
import { PlaylistsToSortResolver } from './resolvers/playlists-to-sort.resolver';
import { UserDetailsResolver } from './resolvers/user-details.resolver';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { ConfirmationGuardService } from './services/guards/confirmation-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      userDetails: UserDetailsResolver
    },
    children: []
  },
  {
    path: 'sort',
    component: SortStepperComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [ConfirmationGuardService],
    resolve: {
      playlists: PlaylistsToSortResolver
    }
  },
  {
    path: 'create',
    component: CreateStepperComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [ConfirmationGuardService],
    resolve: {
      playlists: PlaylistsToCreateResolver
    }
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'privacy', component: PrivacyComponent
  },
  {
    path: 'error', component: ErrorPageComponent
  },
  {
    path: 'not-found', component: NotFoundComponent
  },
  {
    path: '**', redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
