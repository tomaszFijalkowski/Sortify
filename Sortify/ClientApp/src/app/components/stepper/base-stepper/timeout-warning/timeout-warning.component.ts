import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-timeout-warning',
  templateUrl: './timeout-warning.component.html',
  styleUrls: ['./timeout-warning.component.sass']
})
export class TimeoutWarningComponent implements OnInit {
  isSorting: boolean;

  constructor(public dialogRef: MatDialogRef<TimeoutWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {isSorting: boolean}) {
  }

  ngOnInit() {
    this.isSorting = this.data.isSorting;
  }

  onConfirmClick(): void {
    this.dialogRef.close({confirmed: true});
  }
}
