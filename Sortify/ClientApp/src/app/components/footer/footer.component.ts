import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { faGithubSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  github = faGithubSquare;
  linkedin = faLinkedin;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logoff();
  }

  login(): void {
    this.authService.login();
  }
}
