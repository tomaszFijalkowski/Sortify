import { map } from 'rxjs/internal/operators/map';
import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.sass']
})
export class ErrorPageComponent implements OnInit {
  statusCode: number;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe(state => {
      this.statusCode = state['statusCode'] || 500;
      this.errorMessage = state['errorMessage'] || 'Something\xa0went\xa0wrong. Please\xa0try\xa0again\xa0later.';
    });
  }

  login(): void {
    this.authService.login();
  }

  get showLoginButton(): boolean {
    return this.statusCode === 401;
  }
}
