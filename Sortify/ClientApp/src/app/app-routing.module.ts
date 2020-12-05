import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './helpers/auth-guard.service';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { PlaylistResolver } from './resolvers/playlist.resolver';

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
