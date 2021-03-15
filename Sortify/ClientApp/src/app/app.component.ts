import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { BREAKPOINT_TABLET } from './models/constants/resolution-breakpoints';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  isOnStepper: boolean;

  constructor(router: Router) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.isOnStepper = route.url === '/sort' || route.url === '/create';
        this.setBodyBackground();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.setBodyBackground();
  }

  private setBodyBackground(): void {
    const backgroundColor = this.hideBackgroundImage ? '#282828' : '#191919';
    document.body.style.backgroundColor = backgroundColor;
  }

  get hideBackgroundImage(): boolean {
    return this.isOnStepper && window.innerWidth <= BREAKPOINT_TABLET;
  }
}
