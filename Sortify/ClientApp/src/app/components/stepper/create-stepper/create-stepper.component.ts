import { finalize } from 'rxjs/operators';
import { BREAKPOINT_TABLET } from 'src/app/models/constants/resolution-breakpoints';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { CreationForm, CreationFormChangedEvent } from 'src/app/models/events/creation-form-changed.event';
import { RequestDetails } from 'src/app/models/request-details';
import { CreatePlaylistsRequest } from 'src/app/models/requests/create-playlists.request';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { PlaylistService } from 'src/app/services/playlist.service';

import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    const taskWeight = this.estimateTaskWeight();

    if (taskWeight > this.timeoutWarningThreshold) {
      const dialog = this.openTimeoutWarning(false);
      dialog.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.createPlaylists(taskWeight);
        }
      });
    } else {
      this.createPlaylists(taskWeight);
    }
  }

  private createPlaylists(taskWeight: number): void {
    this.prepareEndScreen();
    this.establishHubConnection();
    this.hubConnection
      .start()
      .then(() => this.hubConnection.invoke('getConnectionId'))
      .then((connectionId: string) => {
        if (connectionId) {
          this.sendRequest(connectionId, taskWeight);
        }
      }).catch(() => this.request = new RequestDetails(RequestState.Error, 100, 'Could not establish connection to the server.'));
  }

  private sendRequest(connectionId: string, taskWeight: number): void {
    const request = new CreatePlaylistsRequest(
      connectionId,
      taskWeight,
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
      }, (error: HttpErrorResponse) => {
        const errorMessage = error.status === 504
          ? 'The\u00A0request\u00A0timed\u00A0out. Please\u00A0lower\u00A0the\u00A0total\u00A0amount\u00A0of\u00A0tracks.'
          : 'Something\u00A0went\u00A0wrong. Please\u00A0try\u00A0again\u00A0later';

        this.request = new RequestDetails(RequestState.Error, 100, errorMessage);
      });
  }
}
