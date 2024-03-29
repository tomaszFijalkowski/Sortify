import { sum } from 'lodash';
import { Subscription } from 'rxjs';
import { BREAKPOINT_TABLET } from 'src/app/models/constants/resolution-breakpoints';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { SelectionChangedEvent } from 'src/app/models/events/selection-changed.event';
import { SortByChangedEvent } from 'src/app/models/events/sort-by-changed.event';
import { RequestDetails } from 'src/app/models/request-details';
import { Playlist } from 'src/app/models/responses/get-playlists.response';
import { SortableItem } from 'src/app/models/sortable-item';
import { AppSettingsService } from 'src/app/services/app-settings.service';

import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/esm/HubConnectionBuilder';

import { TimeoutWarningComponent } from './timeout-warning/timeout-warning.component';

@Component({
  selector: 'app-base-stepper',
  template: '',
  styleUrls: ['./base-stepper.component.sass']
})
export class BaseStepperComponent {
  protected taskHubUrl: string;
  protected timeoutWarningThreshold: number;

  playlists: Playlist[];
  selectedPlaylists: Playlist[] = [];

  sortBy: SortableItem[] = [];
  protected sortByAudioFeatures: boolean;

  request = new RequestDetails(RequestState.Ready, 0, 'Preparing tracks');
  protected requestSubscription: Subscription;
  protected hubConnection: HubConnection;

  shrinkWindow = false;

  @ViewChild('stepper') protected stepper: MatStepper;

  constructor(protected dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private settingsService: AppSettingsService) {
  }

  onInit(): void {
    const data = this.activatedRoute.snapshot.data;
    this.playlists = data['playlists'].result.playlists;
    this.taskHubUrl = this.settingsService.appSettings.taskHubUrl;
    this.timeoutWarningThreshold = this.settingsService.appSettings.timeoutWarningThreshold;
  }

  afterViewInit(): void {
    this.removeEndStepHeader();
  }

  private removeEndStepHeader(): void {
    this.stepper._stepHeader.reset([...this.stepper._stepHeader].slice(0, -1));
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
    this.stepper.next();
  }

  protected establishHubConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.taskHubUrl)
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

    return sum(playlistWeights);
  }

  protected openTimeoutWarning(isSorting: boolean): MatDialogRef<TimeoutWarningComponent> {
    return this.dialog.open(TimeoutWarningComponent, {
      data: { 'isSorting': isSorting },
      width: '415px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'confirm'
    });
  }
}
