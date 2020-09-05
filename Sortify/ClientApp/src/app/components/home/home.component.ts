import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login();
  }
}
