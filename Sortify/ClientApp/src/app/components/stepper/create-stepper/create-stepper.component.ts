import { finalize } from 'rxjs/operators';
import { CreatePlaylistsRequest } from 'src/app/models/create-playlists.request';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { CreationForm, CreationFormChangedEvent } from 'src/app/models/events/creation-form-changed.event';
import { RequestDetails } from 'src/app/models/request-details';
import { BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseStepperComponent } from '../base-stepper/base-stepper.component';

@Component({
  selector: 'app-create-stepper',
  templateUrl: './create-stepper.component.html',
  styleUrls: ['./create-stepper.component.sass']
})

export class CreateStepperComponent extends BaseStepperComponent implements OnInit, AfterViewInit, OnDestroy {
  creationForm: CreationForm;
  creationFormValid: boolean;

  private creatingMultiplePlaylists: boolean;

  constructor(activatedRoute: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
    settingsService: AppSettingsService,
    private playlistService: PlaylistService) {
      super(activatedRoute, changeDetector, settingsService);
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

  onCreationFormChanged(event: CreationFormChangedEvent): void {
    this.creationForm = event.creationForm;
    this.creationFormValid = event.creationFormValid;
    this.creatingMultiplePlaylists = event.creatingMultiplePlaylists;
  }

  get selectionStepHeader(): string {
    return window.innerWidth > BREAKPOINT_TABLET ? 'Select the source' : 'Source';
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
    this.prepareEndScreen();
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

    this.requestSubscription = this.playlistService.createPlaylists(request)
      .pipe(finalize(() => this.hubConnection?.stop()))
      .subscribe(response => {
        this.request = response.successful
          ? new RequestDetails(RequestState.Successful, 100, 'Complete')
          : new RequestDetails(RequestState.Error, 100, response.errorMessage);
      }, () => {
        this.request = new RequestDetails(RequestState.Error, 100, 'Something went wrong. Please try again later.');
      });
  }
}
