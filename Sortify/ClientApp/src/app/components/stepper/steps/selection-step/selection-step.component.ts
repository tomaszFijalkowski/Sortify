import { finalize } from 'rxjs/operators';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { GetPlaylistsResponse, Playlist } from 'src/app/models/get-playlists.response';
import { OperationResult } from 'src/app/models/operation-result';
import { BREAKPOINT_PHONE, BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { PlaylistService } from 'src/app/services/playlist.service';
import { UserService } from 'src/app/services/user.service';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  errorOccurred = false;

  @ViewChild('filterInputRef', { read: ElementRef }) filterInput: ElementRef;
  @ViewChild('tableContainerRef', { read: ElementRef }) tableContainer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() playlists: Playlist[];
  @Input() limitByOwner: boolean;
  @Output() selectionChanged = new EventEmitter();

  constructor(private userService: UserService,
    private playlistService: PlaylistService) {
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

  get showErrorMessage(): boolean {
    return !this.dataSourceLoading && this.errorOccurred;
  }

  get showNoResultsFound(): boolean {
    return !this.dataSourceLoading && this.dataSource.filteredData.length === 0 && !this.errorOccurred;
  }

  get imgSize(): number {
    return window.innerWidth > BREAKPOINT_TABLET ? 100 : window.innerWidth > BREAKPOINT_PHONE ? 90 : 80;
  }

  get showCreatedByText(): boolean {
    return window.innerWidth > BREAKPOINT_PHONE;
  }

  get disableClearFilter(): boolean {
    return this.filterInput?.nativeElement.value === '';
  }

  applyFilter(): void {
    const filterValue = this.filterInput.nativeElement.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.setDefaultTabIndex();
  }

  clearFilter(): void {
    this.filterInput.nativeElement.value = '';
    this.dataSource.filter = '';
    this.setDefaultTabIndex();
  }

  refreshSelection(): void {
    const ownerId = this.limitByOwner ? this.userService.currentUserDetails.id : null;

    this.playlistService.getPlaylists(ownerId)
      .pipe(finalize(() => this.dataSourceLoading = false))
      .subscribe((response: OperationResult<GetPlaylistsResponse>) => {
        if (response.successful) {
          this.dataSource.data = response.result.playlists;
          this.errorOccurred = false;
          this.setDefaultTabIndex();
        } else {
          this.errorOccurred = true;
        }
      }, () => {
        this.errorOccurred = true;
      });

    this.dataSource.data = [];
    this.dataSourceLoading = true;
    this.clearSelection();
  }

  clearSelection(): void {
    this.selection.clear();
  }

  onPageChanged(): void {
    this.setDefaultTabIndex();
    this.tableContainer.nativeElement.scrollTo(0, 0);
  }

  private setDefaultTabIndex(): void {
    setTimeout(() => {
      this.setTabIndexAndFocus();
    }, 0);
  }

  tableKeydown(event: KeyboardEvent, tableRow: Playlist): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.focusTableRow(event, 'previous');
      break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusTableRow(event, 'next');
      break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.selectTableRow(event, tableRow);
      break;
    }
  }

  private focusTableRow(event: KeyboardEvent, sibling: 'previous' | 'next'): void {
    const currentElement = (event.currentTarget as HTMLElement);
    const elementToFocus = sibling === 'previous'
      ? (currentElement.previousElementSibling as HTMLElement)
      : (currentElement.nextElementSibling as HTMLElement);

    if (elementToFocus) {
      this.setTabIndexAndFocus(elementToFocus);
    }
  }

  selectTableRow(event: KeyboardEvent | MouseEvent, tableRow: Playlist): void {
    const elementToFocus = (event.currentTarget as HTMLElement);
    this.setTabIndexAndFocus(elementToFocus);
    this.selection.toggle(tableRow);
  }

  private setTabIndexAndFocus(elementToFocus: HTMLElement = null): void {
    const tableRows = document.querySelectorAll('mat-row');
    let defaultFocus = tableRows[0] as HTMLElement;

    tableRows.forEach(row => {
      const rowElement = (row as HTMLElement);

      if (rowElement.tabIndex === 0) {
        defaultFocus = rowElement;
      }
      rowElement.tabIndex = -1;
    });

    if (elementToFocus) {
      elementToFocus.tabIndex = 0;
      elementToFocus.focus();
    } else if (defaultFocus) {
      defaultFocus.tabIndex = 0;
    }
  }
}
