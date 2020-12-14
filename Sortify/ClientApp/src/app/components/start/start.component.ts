import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
  stepperLoading: boolean;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  create(): void {
    this.stepperLoading = true;
    this.router.navigate(['/stepper']);
  }
}
