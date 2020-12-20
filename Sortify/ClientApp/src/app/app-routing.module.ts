import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { PlaylistResolver } from './resolvers/playlist.resolver';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { ConfirmationGuardService } from './services/guards/confirmation-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    children: []
  },
  {
    path: 'start',
    component: StartComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'stepper',
    component: StepperComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [ConfirmationGuardService],
    resolve: {
      playlists: PlaylistResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
