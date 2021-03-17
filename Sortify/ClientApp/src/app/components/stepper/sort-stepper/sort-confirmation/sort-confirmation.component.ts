import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-confirmation',
  templateUrl: './sort-confirmation.component.html',
  styleUrls: ['./sort-confirmation.component.sass']
})
export class SortConfirmationComponent implements OnInit {
  multiplePlaylists: boolean;
  onConfirm = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {multiplePlaylists: boolean}) {
  }

  ngOnInit() {
    this.multiplePlaylists = this.data.multiplePlaylists;
  }

  onConfirmClick(): void {
    this.onConfirm.emit();
  }
}
