import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { BREAKPOINT_TABLET } from './models/constants/resolution-breakpoints';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  isOnStepper: boolean;
  isLoading: boolean;

  constructor(private router: Router,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.onRouteChange();
    this.onLoadingChange();
  }

  private onRouteChange(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.isOnStepper = route.url === '/sort' || route.url === '/create';
        this.setBodyBackground();
      }
    });
  }

  private onLoadingChange(): void {
    this.loadingService.isLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
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
