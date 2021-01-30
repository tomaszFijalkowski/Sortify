import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreateStepperComponent } from './components/stepper/create-stepper/create-stepper.component';
import { SortStepperComponent } from './components/stepper/sort-stepper/sort-stepper.component';
import { PlaylistResolver } from './resolvers/playlist.resolver';
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
      playlists: PlaylistResolver
    }
  },
  {
    path: 'create',
    component: CreateStepperComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [ConfirmationGuardService],
    resolve: {
      playlists: PlaylistResolver
    }
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
