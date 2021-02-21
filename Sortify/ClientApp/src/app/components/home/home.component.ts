import { UserDetails } from 'src/app/models/get-user-details.response';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  userDetails: UserDetails;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      const data = this.activatedRoute.snapshot.data;
      this.userDetails = data.userDetails.result.userDetails;
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
