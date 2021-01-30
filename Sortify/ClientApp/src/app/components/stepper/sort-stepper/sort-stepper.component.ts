import 'lodash';

import { Subscription } from 'rxjs/internal/Subscription';
import { CreatePlaylistsRequest } from 'src/app/models/create-playlists.request';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { SortByChangedEvent } from 'src/app/models/events/sort-by-changed.event';
import { Playlist } from 'src/app/models/get-playlists.response';
import { RequestDetails } from 'src/app/models/request-details';
import { BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { SortPlaylistsRequest } from 'src/app/models/sort-playlists.request';
import { SortableItem } from 'src/app/models/sortable-item';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/esm/HubConnectionBuilder';

declare const _: any;

@Component({
  selector: 'app-sort-stepper',
  templateUrl: './sort-stepper.component.html',
  styleUrls: ['./sort-stepper.component.sass']
})

export class SortStepperComponent implements OnInit, OnDestroy {
  private progressHubUrl: string;

  playlists: Playlist[];
  selectedPlaylists: Playlist[] = [];
  sortingMultiplePlaylists: boolean;

  sortBy: SortableItem[] = [];
  sortByAudioFeatures: boolean;

  request = new RequestDetails(RequestState.Ready, 0, 'Preparing tracks');
  requestSubscription: Subscription;
  hubConnection: HubConnection;

  shrinkWindow = false;

  constructor(private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private settingsService: AppSettingsService,
    private playlistService: PlaylistService) {
  }

  ngOnInit() {
    const data = this.activatedRoute.snapshot.data;
    this.playlists = data.playlists.result.playlists;
    this.progressHubUrl = this.settingsService.appSettings.progressHubUrl;
  }

  ngOnDestroy() {
    this.cancelRequest();
  }

  onStepChanged(): void {
    if (window.innerWidth <= BREAKPOINT_TABLET) {
      window.scroll(0, 0);
    }
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectedPlaylists = event.selectedPlaylists;
    this.sortingMultiplePlaylists = event.selectedPlaylists.length > 1;
  }

  onSortByChanged(event: SortByChangedEvent): void {
    this.sortBy = event.sortBy;
    this.sortByAudioFeatures = event.sortByAudioFeatures;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.changeDetector.detectChanges();
  }

  get selectionStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Select the playlists' : 'Playlists';
  }

  get sortingStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Choose the sorting' : 'Sorting';
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
    this.request.state = RequestState.InProgress;
    this.shrinkWindow = true;
  }

  private sortPlaylists(): void {
    this.establishHubConnection();
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

  private establishHubConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.progressHubUrl)
      .build();

    this.hubConnection.on('progressUpdate', response => {
      this.request.progress = response.progress;
      this.request.description = response.description;
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

    this.requestSubscription = this.playlistService.sortPlaylists(request).subscribe(response => {
      this.request = response.successful
        ? new RequestDetails(RequestState.Successful, 100, 'Complete')
        : new RequestDetails(RequestState.Error, 0, response.errorMessage);

      this.hubConnection?.stop();
    });
  }

  private estimateTaskWeight(): number {
    const maxItemsPerRequest = 100;
    const playlistWeights = this.selectedPlaylists.map(x =>
      Math.max(Math.ceil(x.size / maxItemsPerRequest), 1));

    return _.sum(playlistWeights);
  }

  cancelRequest(): void {
    this.request = new RequestDetails(RequestState.Cancelled, 100, 'Request cancelled');
    this.requestSubscription?.unsubscribe();
    this.hubConnection?.stop();
  }

  backToStepper(): void {
    this.shrinkWindow = false;
    this.clearRequest();
  }

  private clearRequest(): void {
    this.request = new RequestDetails(RequestState.Ready, 0, 'Preparing tracks');
  }
}
