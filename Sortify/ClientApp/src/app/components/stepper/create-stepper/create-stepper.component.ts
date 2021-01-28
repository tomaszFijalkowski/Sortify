import 'lodash';

import { Subscription } from 'rxjs/internal/Subscription';
import { CreatePlaylistsRequest } from 'src/app/models/create-playlists.request';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { CreationForm, CreationFormChangedEvent } from 'src/app/models/events/creation-form-changed.event';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { SortByChangedEvent } from 'src/app/models/events/sort-by-changed.event';
import { Playlist } from 'src/app/models/get-playlists.response';
import { RequestDetails } from 'src/app/models/request-details';
import { BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { SortableItem } from 'src/app/models/sortable-item';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/esm/HubConnectionBuilder';

declare const _: any;

@Component({
  selector: 'app-create-stepper',
  templateUrl: './create-stepper.component.html',
  styleUrls: ['./create-stepper.component.sass']
})

export class CreateStepperComponent implements OnInit, OnDestroy {
  private progressHubUrl: string;

  playlists: Playlist[];
  selectedPlaylists: Playlist[] = [];

  sortBy: SortableItem[] = [];
  sortByAudioFeatures: boolean;

  creationForm: CreationForm;
  creationFormValid: boolean;
  creatingMultiplePlaylists: boolean;

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

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectedPlaylists = event.selectedPlaylists;
  }

  onSortByChanged(event: SortByChangedEvent): void {
    this.sortBy = event.sortBy;
    this.sortByAudioFeatures = event.sortByAudioFeatures;
  }

  onCreationFormChanged(event: CreationFormChangedEvent): void {
    this.creationForm = event.creationForm;
    this.creationFormValid = event.creationFormValid;
    this.creatingMultiplePlaylists = event.creatingMultiplePlaylists;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.changeDetector.detectChanges();
  }

  get selectionStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Select the source' : 'Source';
  }

  get sortingStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Choose the sorting' : 'Sorting';
  }

  get creatingStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Set the output' : 'Output';
  }

  get createDisabled(): boolean {
    return this.selectedPlaylists.length === 0 || this.sortBy.length === 0 || !this.creationFormValid;
  }

  get createDisabledTooltip(): string {
    const validationMessages = [
      `${this.selectedPlaylists.length === 0 ? '✖' : '✔'} Select the source`,
      `${this.sortBy.length === 0 ? '✖' : '✔'} Choose the sorting`,
      `${!this.creationFormValid ? '✖' : '✔'} Name your playlist${ this.creatingMultiplePlaylists ? 's' : '' }`
    ];

    return validationMessages.join('\n');
  }

  get endHeader(): string {
    return `Creating the playlist${ this.creatingMultiplePlaylists ? 's' : '' }`;
  }

  onCreateClick(): void {
    this.createPlaylists();
    this.request.state = RequestState.InProgress;
    this.shrinkWindow = true;
  }

  private createPlaylists(): void {
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
    const request = new CreatePlaylistsRequest(
      connectionId,
      this.estimateTaskWeight(),
      this.selectedPlaylists.map(x => x.id),
      this.sortBy.map(x => `${ x.value } ${ x.order }`),
      this.sortByAudioFeatures,
      this.creationForm.smartSplit,
      this.creationForm.smartSplit ? this.creationForm.smartSplitType : null,
      this.creationForm.name,
      this.creationForm.numberingPlacement,
      this.creationForm.numberingStyle,
      this.creationForm.description,
      this.creationForm.isSecret,
      this.creationForm.splitByTracksNumber,
      this.creationForm.splitByPlaylistsNumber
    );

    this.requestSubscription = this.playlistService.createPlaylists(request).subscribe(response => {
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
