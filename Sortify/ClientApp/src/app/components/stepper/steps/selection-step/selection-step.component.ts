import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { GetPlaylistsResponse, Playlist } from 'src/app/models/get-playlists.response';
import { OperationResult } from 'src/app/models/operation-result';
import { BREAKPOINT_PHONE, BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { PlaylistService } from 'src/app/services/playlist.service';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-selection-step',
  templateUrl: './selection-step.component.html',
  styleUrls: ['./selection-step.component.sass']
})
export class SelectionStepComponent implements OnInit {
  readonly pageSizeOptions = [5, 10, 20];
  readonly displayedColumns: string[] = ['playlist-image', 'playlist-details'];

  dataSource = new MatTableDataSource<Playlist>();
  dataSourceLoading: boolean;
  selection = new SelectionModel<Playlist>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() playlists: Playlist[];
  @Output() selectionChanged = new EventEmitter();

  constructor(private playlistService: PlaylistService) {
  }

  ngOnInit() {
    this.setupDataSource();
    this.onSelectionChanged();
  }

  private setupDataSource(): void {
    this.dataSource.data = this.playlists;
    this.dataSource.paginator = this.paginator;
  }

  private onSelectionChanged(): void {
    this.selection.changed.subscribe(() => {
      this.selectionChanged.next(new SelectionChangedEvent(this.selection.selected));
    });
  }

  get imgSize(): number {
    return window.innerWidth > BREAKPOINT_TABLET ? 100 : window.innerWidth > BREAKPOINT_PHONE ? 90 : 80;
  }

  get showCreatedByText(): boolean {
    return window.innerWidth > BREAKPOINT_PHONE;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshSelection(): void {
    this.playlistService.getPlaylists().subscribe((response: OperationResult<GetPlaylistsResponse>) => {
      this.selection.clear();
      this.dataSource.data = response.result.playlists;
      this.dataSourceLoading = false;
    });
    this.dataSource.data = [];
    this.dataSourceLoading = true;
    this.clearSelection();
  }

  clearSelection(): void {
    this.selection.clear();
  }
}
