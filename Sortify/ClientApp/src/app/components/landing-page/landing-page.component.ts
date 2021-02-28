import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { VideoPreviewComponent } from './video-preview/video-preview.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {
  constructor(private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  login(): void {
    this.authService.login();
  }

  openVideoPreview(): void {
    this.dialog.open(VideoPreviewComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'video-preview',
      backdropClass: 'video-preview-backdrop',
      restoreFocus: false
    });
  }
}
