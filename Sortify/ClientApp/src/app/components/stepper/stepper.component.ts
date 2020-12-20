import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { GetPlaylistsResponse, Playlist } from 'src/app/models/get-playlists.response';
import { Options, SortableEvent } from 'sortablejs';
import { SortableGroup } from 'src/app/models/enums/sortable-group.enum';
import { SortableItem } from 'src/app/models/sortable-item';
import { CreatePlaylistsRequest } from 'src/app/models/create-playlists.request';
import { PlaylistService } from 'src/app/services/playlist.service';
import { OperationResult } from 'src/app/models/operation-result';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/esm/HubConnectionBuilder';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { RequestDetails } from 'src/app/models/request-details';
import { HubConnection } from '@aspnet/signalr/dist/esm/HubConnection';
import 'lodash';

declare const _: any;

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.sass']
})

export class StepperComponent implements OnInit, AfterViewInit, OnDestroy {
  private progressHubUrl: string;

  // Select the source step (1)
  displayedColumns: string[] = ['playlist-image', 'playlist-details'];
  dataSource = new MatTableDataSource<Playlist>();
  dataSourceLoading: boolean;
  selection = new SelectionModel<Playlist>(true, []);
  selectionCountText: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Choose the sorting step (2)
  basicProperties: SortableItem[] = [
    new SortableItem('Artist name', 'ArtistName', 'asc', 0, SortableGroup.BasicProperties),
    new SortableItem('Album name', 'AlbumName', 'asc', 1, SortableGroup.BasicProperties),
    new SortableItem('Album release date', 'AlbumReleaseDate', 'asc', 2, SortableGroup.BasicProperties),
    new SortableItem('Track duration', 'Duration', 'asc', 3, SortableGroup.BasicProperties),
    new SortableItem('Track name', 'Name', 'asc', 4, SortableGroup.BasicProperties),
    new SortableItem('Track number', 'TrackNumber', 'asc', 5, SortableGroup.BasicProperties),
    new SortableItem('Track popularity', 'Popularity', 'asc', 6, SortableGroup.BasicProperties)
  ];

  audioFeatures: SortableItem[] = [
    new SortableItem('Acousticness', 'AudioFeatures.Acousticness', 'asc', 0, SortableGroup.AudioFeatures),
    new SortableItem('Danceability', 'AudioFeatures.Danceability', 'asc', 1, SortableGroup.AudioFeatures),
    new SortableItem('Energy', 'AudioFeatures.Energy', 'asc', 2, SortableGroup.AudioFeatures),
    new SortableItem('Instrumentalness', 'AudioFeatures.Instrumentalness', 'asc', 3, SortableGroup.AudioFeatures),
    new SortableItem('Liveness', 'AudioFeatures.Liveness', 'asc', 4, SortableGroup.AudioFeatures),
    new SortableItem('Loudness', 'AudioFeatures.Loudness', 'asc', 5, SortableGroup.AudioFeatures),
    new SortableItem('Speechiness', 'AudioFeatures.Speechiness', 'asc', 6, SortableGroup.AudioFeatures),
    new SortableItem('Tempo', 'AudioFeatures.Tempo', 'asc', 7, SortableGroup.AudioFeatures),
    new SortableItem('Valence', 'AudioFeatures.Valence', 'asc', 8, SortableGroup.AudioFeatures)
  ];

  initialAudioFeaturesLength = this.audioFeatures.length;

  sortBy: SortableItem[] = [];

  basicPropertiesOptions: Options = {
    group: {
      name: 'basicProperties',
    },
    sort: false,
    onStart: event => this.toggleDropzoneBorder(event, true),
    onEnd: event => this.toggleDropzoneBorder(event, false),
    removeOnSpill: false
  };

  audioFeaturesOptions: Options = {
    group: {
      name: 'audioFeatures',
    },
    sort: false,
    onStart: event => this.toggleDropzoneBorder(event, true),
    onEnd: event => this.toggleDropzoneBorder(event, false),
    removeOnSpill: false
  };

  sortByOptions: Options = {
    group: {
      name: 'sortBy',
      put: ['basicProperties', 'audioFeatures'],
    },
    onStart: event => this.toggleDropzoneBorder(event, true),
    onEnd: event => this.toggleDropzoneBorder(event, false),
    onSpill: event => this.removeItemOnSpill(event),
    removeOnSpill: true
  };

  dropzoneIsVisible: boolean;
  dropzoneIsHighlightedGreen: boolean;
  dropzoneIsHighlightedRed: boolean;

  // Set the output step (3)
  formGroup: FormGroup;

  readonly splitByTracksMinNumber = 20;
  readonly splitByTracksMaxNumber = 10000;
  readonly splitByPlaylistsMinNumber = 2;
  readonly splitByPlaylistsMaxNumber = 100;

  splitByTracksSelected = false;
  splitByPlaylistsSelected = false;

  @ViewChild('splitByTracksInput', {static: true}) splitByTracksInput: ElementRef;
  @ViewChild('splitByPlaylistsInput', {static: true}) splitByPlaylistsInput: ElementRef;

  readonly nameMaxLength = 100;
  readonly descriptionMaxLength = 300;
  readonly numberingStyles = ['arabic', 'roman', 'upperCaseRoman', 'alphabet', 'upperCaseAlphabet'];
  readonly numberingStyleDisplays = {
    'arabic': ['1', '2', '3', '4'],
    'roman': ['i', 'ii', 'iii', 'iv'],
    'upperCaseRoman': ['I', 'II', 'III', 'IV'],
    'alphabet': ['a', 'b', 'c', 'd'],
    'upperCaseAlphabet': ['A', 'B', 'C', 'D']
  };

  selectedNumberingPlacement: 'before' | 'after';
  selectedNumberingStyle: string;

  // Create step
  request = new RequestDetails(RequestState.Ready, 0, 'Preparing tracks');
  requestSubscription: Subscription;
  hubConnection: HubConnection;

  shrinkWindow = false;

  // General setup
  constructor(private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private settingsService: AppSettingsService,
    private playlistService: PlaylistService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.progressHubUrl = this.settingsService.appSettings.progressHubUrl;
    this.setupDataSource();
    this.buildFormGroup();
  }

  ngAfterViewInit() {
    this.selectedNumberingPlacement = 'before';
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.cancelRequest();
  }

  private setupDataSource(): void {
    const data = this.activatedRoute.snapshot.data;
    this.dataSource.data = data.playlists.result.playlists;
    this.dataSource.paginator = this.paginator;
  }

  private buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      splitByTracksNumber: new FormControl(200,
        [Validators.required, Validators.min(this.splitByTracksMinNumber), Validators.max(this.splitByTracksMaxNumber)]),
      splitByPlaylistsNumber: new FormControl(2,
        [Validators.required, Validators.min(this.splitByPlaylistsMinNumber), Validators.max(this.splitByPlaylistsMaxNumber)]),
      smartSplit: new FormControl({value: false, disabled: true}),
      smartSplitType: new FormControl({value: 'albums', disabled: true}),
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      numberingPlacement: new FormControl('before'),
      numberingStyle: new FormControl({value: null, disabled: true}),
      description: new FormControl(null, [Validators.maxLength(300)]),
      isSecret: new FormControl(false)
    });
  }

  // Select the source step (1)
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

  // Choose the sorting step (2)
  private toggleDropzoneBorder(sortableEvent: SortableEvent, flag: boolean): void {
    const draggedItem = sortableEvent.item;

    if (flag) {
      draggedItem.addEventListener('drag',
        this.highlightDropzoneBorder.bind(this, sortableEvent), false);
    } else {
      draggedItem.removeEventListener('drag',
        this.highlightDropzoneBorder.bind(this, sortableEvent), false);
      this.dropzoneIsHighlightedGreen = false;
      this.dropzoneIsHighlightedRed = false;
    }

    this.dropzoneIsVisible = flag;
    this.changeDetector.detectChanges();
  }

  private highlightDropzoneBorder = function (sortableEvent: SortableEvent, dragEvent: DragEvent): void {
    const dropzone = document.getElementById('dropzone');
    const dropzoneRect = dropzone.getBoundingClientRect();

    const isCursorInsideDropzone = (dragEvent.x >= dropzoneRect.left && dragEvent.x <= dropzoneRect.right &&
                                    dragEvent.y >= dropzoneRect.top && dragEvent.y <= dropzoneRect.bottom);

    const itemRect = sortableEvent.item.getBoundingClientRect();
    const isItemInsideDropzone = (itemRect.left >= dropzoneRect.left && itemRect.left <= dropzoneRect.right &&
                                  itemRect.top >= dropzoneRect.top && itemRect.top <= dropzoneRect.bottom);

    this.dropzoneIsHighlightedGreen = (isCursorInsideDropzone || isItemInsideDropzone);

    if (sortableEvent.from === dropzone) {
      this.dropzoneIsHighlightedRed = (!isCursorInsideDropzone && isItemInsideDropzone);
    }

    this.changeDetector.detectChanges();
  };

  private removeItemOnSpill(sortableEvent: SortableEvent): void {
    const element = sortableEvent.item;
    const item = this.createSortableItem(element);
    this.removeSortableItem(item);
  }

  removeItemOnClick(mouseEvent: MouseEvent): void {
    const element = mouseEvent.target['parentElement'];
    const item = this.createSortableItem(element);
    this.removeSortableItem(item);
  }

  private removeSortableItem(item: SortableItem): void {
    switch (item.initialGroup) {
      case SortableGroup.BasicProperties:
        this.moveSortableItem(item, this.sortBy, this.basicProperties, true);
        break;
      case SortableGroup.AudioFeatures:
        this.moveSortableItem(item, this.sortBy, this.audioFeatures, true);
        break;
    }
  }

  addItemOnClick(mouseEvent: MouseEvent): void {
    const element = (mouseEvent.target as HTMLElement);
    const item = this.createSortableItem(element);
    this.addSortableItem(item);
  }

  private addSortableItem(item: SortableItem): void {
    switch (item.initialGroup) {
      case SortableGroup.BasicProperties:
        this.moveSortableItem(item, this.basicProperties, this.sortBy, false);
        break;
      case SortableGroup.AudioFeatures:
        this.moveSortableItem(item, this.audioFeatures, this.sortBy, false);
        break;
    }
  }

  private createSortableItem(element: HTMLElement): SortableItem {
    const name = element.dataset['name'];
    const value = element.dataset['value'];
    const order = 'asc'; // TODO
    const initialIndex = Number(element.dataset['initialindex']);
    const initialGroup = SortableGroup[element.dataset['initialgroup']];
    return new SortableItem(name, value, order, initialIndex, initialGroup);
  }

  private moveSortableItem(item: SortableItem, from: SortableItem[], to: SortableItem[], sort: Boolean): void {
    const index = from.findIndex(x => x.name === item.name);
    if (index > -1) {
      from.splice(index, 1);
    }
    to.push(item);

    if (sort) {
      to.sort((a, b) => a.initialIndex - b.initialIndex);
    }
    this.changeDetector.detectChanges();
  }

  // Set the output step (3)
  selectSplitOnClick(splitOn: 'tracks' | 'playlists'): void {
    switch (splitOn) {
      case 'tracks':
        if (!this.splitByTracksSelected) {
          this.splitByTracksInput.nativeElement.focus();
        }
        this.splitByTracksSelected = !this.splitByTracksSelected;
        this.splitByPlaylistsSelected = false;
        break;
      case 'playlists':
        if (!this.splitByPlaylistsSelected) {
          this.splitByPlaylistsInput.nativeElement.focus();
        }
        this.splitByPlaylistsSelected = !this.splitByPlaylistsSelected;
        this.splitByTracksSelected = false;
        break;
    }

    this.toggleSmartSplitCheckbox();
    this.toggleNumberingSelect();
  }

  private toggleSmartSplitCheckbox(): void {
    if (this.splitByTracksSelected || this.splitByPlaylistsSelected) {
      this.formGroup.controls['smartSplit'].enable();
      this.formGroup.controls['smartSplitType'].enable();
    } else {
      this.formGroup.controls['smartSplit'].disable();
      this.formGroup.controls['smartSplitType'].disable();
      this.formGroup.patchValue({
        smartSplit: false
      });
    }
  }

  private toggleNumberingSelect(): void {
    if (this.splitByTracksSelected || this.splitByPlaylistsSelected) {
      this.formGroup.controls['numberingStyle'].enable();
    } else {
      this.formGroup.controls['numberingStyle'].disable();
      this.formGroup.patchValue({
        numberingStyle: null
      });
      this.selectedNumberingStyle = null;
    }
  }

  onSplitByTracksInputBlur(value: number): void {
    this.formGroup.patchValue({
      splitByTracksNumber: _.clamp(value, this.splitByTracksMinNumber, this.splitByTracksMaxNumber)
    });
  }

  onSplitByPlaylistsInputBlur(value: number): void {
    this.formGroup.patchValue({
      splitByPlaylistsNumber: _.clamp(value, this.splitByPlaylistsMinNumber, this.splitByPlaylistsMaxNumber)
    });
  }

  get createDisabled(): boolean {
    return this.selection.selected.length === 0 || this.sortBy.length === 0 || !this.formGroup.valid;
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
      this.selection.selected.map(x => x.id),
      this.sortBy.map(x => `${ x.value } ${ x.order }`),
      this.audioFeatures.length < this.initialAudioFeaturesLength,
      this.formGroup.get('smartSplit').value,
      this.formGroup.get('smartSplit').value ? this.formGroup.get('smartSplitType').value : null,
      this.formGroup.get('name').value,
      this.selectedNumberingStyle ? this.formGroup.get('numberingPlacement').value : null,
      this.formGroup.get('numberingStyle').value,
      this.formGroup.get('description').value,
      this.formGroup.get('isSecret').value,
      this.splitByTracksSelected ? this.formGroup.get('splitByTracksNumber').value : null,
      this.splitByPlaylistsSelected ? this.formGroup.get('splitByPlaylistsNumber').value : null,
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
    const playlistWeights = this.selection.selected.map(x =>
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
