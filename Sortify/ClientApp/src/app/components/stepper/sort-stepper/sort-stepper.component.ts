import { finalize } from 'rxjs/internal/operators/finalize';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { RequestDetails } from 'src/app/models/request-details';
import { SortPlaylistsRequest } from 'src/app/models/sort-playlists.request';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseStepperComponent } from '../base-stepper/base-stepper.component';

@Component({
  selector: 'app-sort-stepper',
  templateUrl: './sort-stepper.component.html',
  styleUrls: ['./sort-stepper.component.sass']
})

export class SortStepperComponent extends BaseStepperComponent implements OnInit, OnDestroy {
  private sortingMultiplePlaylists: boolean;

  blockCancellation = false;

  constructor(activatedRoute: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
    settingsService: AppSettingsService,
    private playlistService: PlaylistService) {
      super(activatedRoute, changeDetector, settingsService);
  }

  ngOnInit() {
    this.onInit();
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
    this.sortPlaylists();
    this.prepareEndScreen();
  }

  private sortPlaylists(): void {
    this.establishHubConnection();
    this.handleCancellationBlock();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('getConnectionId'))
      .then((connectionId: string) => {
        if (connectionId) {
          this.sendRequest(connectionId);
        }
      })
      .catch(() => this.request = new RequestDetails(RequestState.Error, 0, 'Could not establish connection to the server.'));
  }

  private handleCancellationBlock(): void {
    this.blockCancellation = false;
    this.hubConnection.on('cancellationBlock', () => {
      this.blockCancellation = true;
    });
  }

  private sendRequest(connectionId: string): void {
    const request = new SortPlaylistsRequest(
      connectionId,
      this.estimateTaskWeight(),
      this.selectedPlaylists.map(x => x.id),
      this.sortBy.map(x => `${ x.value } ${ x.order }`),
      this.sortByAudioFeatures
    );

    this.requestSubscription = this.playlistService.sortPlaylists(request)
      .pipe(finalize(() => this.hubConnection?.stop()))
      .subscribe(response => {
        this.request = response.successful
          ? new RequestDetails(RequestState.Successful, 100, 'Complete')
          : new RequestDetails(RequestState.Error, 0, response.errorMessage);

        this.hubConnection?.stop();
      }, () => {
        this.request = new RequestDetails(RequestState.Error, 0, 'Something went wrong. Please try again later.');
      });
  }
}
