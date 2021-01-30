import 'lodash';

import { Subscription } from 'rxjs';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { SortByChangedEvent } from 'src/app/models/events/sort-by-changed.event';
import { Playlist } from 'src/app/models/get-playlists.response';
import { RequestDetails } from 'src/app/models/request-details';
import { BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { SortableItem } from 'src/app/models/sortable-item';
import { AppSettingsService } from 'src/app/services/app-settings.service';

import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/esm/HubConnectionBuilder';

declare const _: any;

@Component({
  selector: 'app-base-stepper',
  template: '',
  styleUrls: ['./base-stepper.component.sass']
})
export class BaseStepperComponent {
  protected progressHubUrl: string;

  playlists: Playlist[];
  selectedPlaylists: Playlist[] = [];

  sortBy: SortableItem[] = [];
  protected sortByAudioFeatures: boolean;

  request = new RequestDetails(RequestState.Ready, 0, 'Preparing tracks');
  protected requestSubscription: Subscription;
  protected hubConnection: HubConnection;

  shrinkWindow = false;

  constructor(private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private settingsService: AppSettingsService) {
  }

  onInit(): void {
    const data = this.activatedRoute.snapshot.data;
    this.playlists = data.playlists.result.playlists;
    this.progressHubUrl = this.settingsService.appSettings.progressHubUrl;
  }

  onDestroy(): void {
    this.cancelRequest();
  }

  onStepChanged(): void {
    if (window.innerWidth <= BREAKPOINT_TABLET) {
      window.scroll(0, 0);
    }
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectedPlaylists = event.selectedPlaylists;
  }

  onSortByChanged(event: SortByChangedEvent): void {
    this.sortBy = event.sortBy;
    this.sortByAudioFeatures = event.sortByAudioFeatures;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.changeDetector.detectChanges();
  }

  get selectionStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Select the playlists' : 'Playlists';
  }

  get sortingStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Choose the sorting' : 'Sorting';
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

  protected prepareEndScreen(): void {
    this.request.state = RequestState.InProgress;
    this.shrinkWindow = true;
  }

  protected establishHubConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.progressHubUrl)
      .build();

    this.hubConnection.on('progressUpdate', response => {
      this.request.progress = response.progress;
      this.request.description = response.description;
    });
  }

  protected estimateTaskWeight(): number {
    const maxItemsPerRequest = 100;
    const playlistWeights = this.selectedPlaylists.map(x =>
      Math.max(Math.ceil(x.size / maxItemsPerRequest), 1));

    return _.sum(playlistWeights);
  }
}
