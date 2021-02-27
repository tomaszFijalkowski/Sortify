import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { BREAKPOINT_TABLET } from './models/resolution-breakpoints';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  isOnStepper: boolean;
  showFooterIconTransitions = false;

  constructor(router: Router) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.isOnStepper = route.url === '/sort' || route.url === '/create';
      }
    });
    setTimeout(() => this.showFooterIconTransitions = true, 600);
  }

  get hideBackgroundImage(): boolean {
    return this.isOnStepper && window.innerWidth <= BREAKPOINT_TABLET;
  }
}
