import { Options, SortableEvent } from 'sortablejs';
import { SortableGroup } from 'src/app/models/enums/sortable-group.enum';
import { SortByChangedEvent } from 'src/app/models/events/sort-by-changed.event';
import { SortableItem } from 'src/app/models/sortable-item';

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sorting-step',
  templateUrl: './sorting-step.component.html',
  styleUrls: ['./sorting-step.component.sass']
})
export class SortingStepComponent implements OnInit {
  basicProperties: SortableItem[];
  audioFeatures: SortableItem[];
  sortBy: SortableItem[];

  initialAudioFeaturesLength: number;

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
    removeOnSpill: false,
    filter: '.disabled'
  };

  sortByOptions: Options = {
    group: {
      name: 'sortBy',
      put: ['basicProperties', 'audioFeatures'],
    },
    onStart: event => this.toggleDropzoneBorder(event, true),
    onEnd: event => this.toggleDropzoneBorder(event, false),
    onSpill: event => this.deselectChipOnSpill(event),
    removeOnSpill: true
  };

  dropzoneIsVisible: boolean;
  dropzoneIsHighlightedGreen: boolean;
  dropzoneIsHighlightedRed: boolean;

  recommendedSorting = false;

  @Output() sortByChanged = new EventEmitter();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.setInitialSorting();
  }

  private setInitialSorting(): void {
    this.basicProperties = [
      new SortableItem('Artist name', 'ArtistName', 'asc', 0, SortableGroup.BasicProperties),
      new SortableItem('Album name', 'AlbumName', 'asc', 1, SortableGroup.BasicProperties),
      new SortableItem('Album release date', 'AlbumReleaseDate', 'asc', 2, SortableGroup.BasicProperties),
      new SortableItem('Disc number', 'DiscNumber', 'asc', 3, SortableGroup.BasicProperties),
      new SortableItem('Track duration', 'Duration', 'asc', 4, SortableGroup.BasicProperties),
      new SortableItem('Track name', 'Name', 'asc', 5, SortableGroup.BasicProperties),
      new SortableItem('Track number', 'TrackNumber', 'asc', 6, SortableGroup.BasicProperties),
      new SortableItem('Track popularity', 'Popularity', 'asc', 7, SortableGroup.BasicProperties)
    ];

    this.audioFeatures = [
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

    this.sortBy = [];

    this.initialAudioFeaturesLength = this.audioFeatures.length;
  }

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

  get audioFeatureSelected(): boolean {
    return this.audioFeatures.length < this.initialAudioFeaturesLength;
  }

  private deselectChipOnSpill(sortableEvent: SortableEvent): void {
    const element = sortableEvent.item;
    const item = this.createSortableItem(element);
    this.deselectSortableItem(item);
  }

  deselectChip(event: MouseEvent | KeyboardEvent, targetParent = false): void {
    const element = targetParent ? event.target['parentElement'] : (event.target as HTMLElement);
    const item = this.createSortableItem(element);
    this.deselectSortableItem(item);
  }

  private deselectSortableItem(item: SortableItem): void {
    switch (item.initialGroup) {
      case SortableGroup.BasicProperties:
        this.moveSortableItem(item, this.sortBy, this.basicProperties, true);
        break;
      case SortableGroup.AudioFeatures:
        this.moveSortableItem(item, this.sortBy, this.audioFeatures, true);
        break;
    }
  }

  selectChip(event: MouseEvent | KeyboardEvent): void {
    const element = (event.target as HTMLElement);
    const item = this.createSortableItem(element);
    this.selectSortableItem(item);
  }

  private selectSortableItem(item: SortableItem): void {
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
    const order = 'asc';
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

    this.emitSortByChanged();
  }

  private emitSortByChanged(recommendedSorting = false): void {
    this.sortByChanged.next(new SortByChangedEvent(
      this.sortBy,
      this.audioFeatureSelected
    ));

    this.recommendedSorting = recommendedSorting;
    this.changeDetector.detectChanges();
  }

  changeOrder(item: SortableItem): void {
    item.order = item.order === 'asc' ? 'desc' : 'asc';
    this.emitSortByChanged();
  }

  setRecommendedSorting(): void {
    this.basicProperties = [
      new SortableItem('Track duration', 'Duration', 'asc', 4, SortableGroup.BasicProperties),
      new SortableItem('Track name', 'Name', 'asc', 5, SortableGroup.BasicProperties),
      new SortableItem('Track popularity', 'Popularity', 'asc', 7, SortableGroup.BasicProperties)
    ];

    this.audioFeatures = [
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

    this.sortBy = [
      new SortableItem('Artist name', 'ArtistName', 'asc', 0, SortableGroup.BasicProperties),
      new SortableItem('Album release date', 'AlbumReleaseDate', 'asc', 2, SortableGroup.BasicProperties),
      new SortableItem('Album name', 'AlbumName', 'asc', 1, SortableGroup.BasicProperties),
      new SortableItem('Disc number', 'DiscNumber', 'asc', 3, SortableGroup.BasicProperties),
      new SortableItem('Track number', 'TrackNumber', 'asc', 6, SortableGroup.BasicProperties)
    ];

    this.initialAudioFeaturesLength = this.audioFeatures.length;
    this.emitSortByChanged(true);
  }

  clearSorting(): void {
    this.setInitialSorting();
    this.emitSortByChanged();
  }
}
