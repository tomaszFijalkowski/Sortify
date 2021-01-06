import { UserDetails } from 'src/app/models/get-user-details.response';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
  @Input() userDetails: UserDetails;
  stepperLoading: boolean;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  sort(): void {
  }

  create(): void {
    this.stepperLoading = true;
    this.router.navigate(['/stepper']);
  }
}
