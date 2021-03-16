import { UserDetails } from 'src/app/models/responses/get-user-details.response';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
  @Input() userDetails: UserDetails;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  sort(): void {
    this.router.navigate(['/sort']);
  }

  create(): void {
    this.router.navigate(['/create']);
  }
}
