import { AuthService } from 'src/app/services/auth.service';

import { ViewportScroller } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-footer-icon',
  templateUrl: './footer-icon.component.html',
  styleUrls: ['./footer-icon.component.sass']
})
export class FooterIconComponent implements OnInit {
  private scrollPosition: 'top' | 'bottom';

  onDialog = false;
  iconHidden = false;
  @Input() hidden: boolean;

  @ViewChild('icon', {static: true}) icon: HTMLElement;

  constructor(private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.onDialogEvents();
    setTimeout(() => {
      this.checkScrollPosition();
    }, 0);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.onDialog) {
      this.checkScrollPosition();
    }
  }

  private onDialogEvents(): void {
    this.dialog.afterOpened.subscribe(() => {
      this.onDialog = true;
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.onDialog = false;
    });
  }

  private checkScrollPosition(): void {
    const marginOfError = 2;

    if ((window.innerHeight + window.scrollY + marginOfError) >= document.body.offsetHeight) {
      this.scrollPosition = 'bottom';
      this.iconHidden = true;
    } else if (window.scrollY === 0) {
      this.scrollPosition = 'top';
      this.iconHidden = false;
    } else {
      this.iconHidden = this.scrollPosition === 'bottom';
    }
  }

  scrollToBottom(): void {
    this.viewportScroller.scrollToPosition([0, document.body.offsetHeight - window.innerHeight]);
  }

  get useSlowFooterIconEntrance(): boolean {
    return !this.hidden && !this.authService.isLoggedIn();
  }

  get useFastFooterIconEntrance(): boolean {
    return !this.hidden && this.authService.isLoggedIn();
  }
}
