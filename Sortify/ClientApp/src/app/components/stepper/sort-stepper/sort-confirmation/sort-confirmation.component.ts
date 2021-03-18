import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-confirmation',
  templateUrl: './sort-confirmation.component.html',
  styleUrls: ['./sort-confirmation.component.sass']
})
export class SortConfirmationComponent implements OnInit {
  multiplePlaylists: boolean;

  constructor(public dialogRef: MatDialogRef<SortConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {multiplePlaylists: boolean}) {
  }

  ngOnInit() {
    this.multiplePlaylists = this.data.multiplePlaylists;
  }

  onConfirmClick(): void {
    this.dialogRef.close({confirmed: true});
  }
}
