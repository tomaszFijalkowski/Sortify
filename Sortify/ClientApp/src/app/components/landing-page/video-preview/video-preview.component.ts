import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.sass']
})
export class VideoPreviewComponent implements OnInit {
  videoLoading: boolean;

  constructor(private dialogRef: MatDialogRef<VideoPreviewComponent>) {
  }

  ngOnInit() {
  }

  onLoadStart(): void {
    const progressSpinnerDelay = 150;
    setTimeout(() => this.videoLoading = this.videoLoading !== false, progressSpinnerDelay);
  }

  onLoadEnd(): void {
    this.videoLoading = false;
  }

  closePreview(): void {
    this.dialogRef.close();
  }
}
