import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.sass']
})
export class VideoPreviewComponent implements OnInit {
  videoLoading: boolean;

  constructor(private dialog: MatDialogRef<VideoPreviewComponent>) {
  }

  ngOnInit() {
  }

  onLoadStart(): void {
    setTimeout(() => this.videoLoading = this.videoLoading !== false, 150);
  }

  onLoadEnd(): void {
    this.videoLoading = false;
  }

  closePreview(): void {
    this.dialog.close();
  }
}
