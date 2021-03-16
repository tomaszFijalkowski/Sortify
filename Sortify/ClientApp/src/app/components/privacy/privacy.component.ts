import { BREAKPOINT_TABLET } from 'src/app/models/constants/resolution-breakpoints';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.sass']
})
export class PrivacyComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    if (window.innerWidth <= BREAKPOINT_TABLET) {
      window.scroll(0, 0);
    }
  }
}
