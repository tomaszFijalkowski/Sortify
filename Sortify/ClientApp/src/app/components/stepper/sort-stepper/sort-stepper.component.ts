import { finalize } from 'rxjs/operators';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { RequestDetails } from 'src/app/models/request-details';
import { SortPlaylistsRequest } from 'src/app/models/requests/sort-playlists.request';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { BaseStepperComponent } from '../base-stepper/base-stepper.component';
import { SortConfirmationComponent } from './sort-confirmation/sort-confirmation.component';

@Component({
  selector: 'app-sort-stepper',
  templateUrl: './sort-stepper.component.html',
  styleUrls: ['./sort-stepper.component.sass']
})

export class SortStepperComponent extends BaseStepperComponent implements OnInit, AfterViewInit, OnDestroy {
  private sortingMultiplePlaylists: boolean;

  preventCancellation = false;

  constructor(dialog: MatDialog,
    activatedRoute: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
    settingsService: AppSettingsService,
    private playlistService: PlaylistService) {
      super(dialog, activatedRoute, changeDetector, settingsService);
  }

  ngOnInit() {
    this.onInit();
  }

  ngAfterViewInit() {
    this.afterViewInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectedPlaylists = event.selectedPlaylists;
    this.sortingMultiplePlaylists = event.selectedPlaylists.length > 1;
  }

  get sortDisabled(): boolean {
    return this.selectedPlaylists.length === 0 || this.sortBy.length === 0;
  }

  get sortDisabledTooltip(): string {
    const validationMessages = [
      `${this.selectedPlaylists.length === 0 ? '✖' : '✔'} Select the playlists`,
      `${this.sortBy.length === 0 ? '✖' : '✔'} Choose the sorting`
    ];

    return validationMessages.join('\n');
  }

  get endHeader(): string {
    return `Sorting the playlist${ this.sortingMultiplePlaylists ? 's' : '' }`;
  }

  onSortClick(): void {
    const dialog = this.dialog.open(SortConfirmationComponent, {
      data: { 'multiplePlaylists': this.sortingMultiplePlaylists },
      width: '395px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'confirm'
    });

    dialog.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.onSortConfirm();
      }
    });
  }

  private onSortConfirm(): void {
    const taskWeight = this.estimateTaskWeight();

    if (taskWeight > this.timeoutWarningThreshold) {
      setTimeout(() => {
        const dialog = this.openTimeoutWarning(true);
        dialog.afterClosed().subscribe(confirmed => {
          if (confirmed) {
            this.sortPlaylists(taskWeight);
          }
        });
      }, 75);
    } else {
      this.sortPlaylists(taskWeight);
    }
  }

  private sortPlaylists(taskWeight: number): void {
    this.prepareEndScreen();
    this.establishHubConnection();
    this.handlePreventCancellation();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('getConnectionId'))
      .then((connectionId: string) => {
        if (connectionId) {
          this.sendRequest(connectionId, taskWeight);
        }
      }).catch(() => this.request = new RequestDetails(RequestState.Error, 100, 'Could not establish connection to the server.'));
  }

  private handlePreventCancellation(): void {
    this.preventCancellation = false;
    this.hubConnection.on('preventCancellation', () => {
      this.preventCancellation = true;
    });
  }

  private sendRequest(connectionId: string, taskWeight: number): void {
    const request = new SortPlaylistsRequest(
      connectionId,
      taskWeight,
      this.selectedPlaylists.map(x => x.id),
      this.sortBy.map(x => `${ x.value } ${ x.order }`),
      this.sortByAudioFeatures
    );

    this.requestSubscription = this.playlistService.sortPlaylists(request)
      .pipe(finalize(() => this.hubConnection?.stop()))
      .subscribe(response => {
        this.request = response.successful
          ? new RequestDetails(RequestState.Successful, 100, 'Complete')
          : new RequestDetails(RequestState.Error, 100, response.errorMessage);
      }, (error: HttpErrorResponse) => {
        const errorMessage = error.status === 504
          ? 'The\u00A0request\u00A0timed\u00A0out. Please\u00A0lower\u00A0the\u00A0total\u00A0amount\u00A0of\u00A0tracks.'
          : 'Something\u00A0went\u00A0wrong. Please\u00A0try\u00A0again\u00A0later';

        this.request = new RequestDetails(RequestState.Error, 100, errorMessage);
      });
  }
}
