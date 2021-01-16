import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  hideBackgroundImg: boolean;

  constructor(router: Router) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.hideBackgroundImg = route.url === 'sort' || route.url === '/create';
      }
    });
  }
}
