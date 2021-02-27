import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
}
