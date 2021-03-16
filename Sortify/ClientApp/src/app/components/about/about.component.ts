import { BREAKPOINT_TABLET } from 'src/app/models/constants/resolution-breakpoints';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    if (window.innerWidth <= BREAKPOINT_TABLET) {
      window.scroll(0, 0);
    }
  }
}
