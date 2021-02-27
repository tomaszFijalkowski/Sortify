import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-icon',
  templateUrl: './footer-icon.component.html',
  styleUrls: ['./footer-icon.component.sass']
})
export class FooterIconComponent implements OnInit {
  scrollPosition: 'top' | 'bottom' | 'inbetween';
  previousPositon: 'top' | 'bottom';

  hideFooterIcon = false;

  constructor(private viewportScroller: ViewportScroller) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.checkScrollPosition();
    }, 0);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.scrollPosition = 'bottom';
      this.previousPositon = 'bottom';
      this.hideFooterIcon = true;
    } else if (window.scrollY === 0) {
      this.scrollPosition = 'top';
      this.previousPositon = 'top';
      this.hideFooterIcon = false;
    } else {
      this.scrollPosition = 'inbetween';
      this.hideFooterIcon = this.previousPositon === 'bottom';
    }
  }

  scrollToBottom(): void {
    this.viewportScroller.scrollToPosition([0, document.body.offsetHeight - window.innerHeight]);
  }
}
