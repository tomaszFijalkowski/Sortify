import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  login(): void {
    this.authService.login();
  }
}
