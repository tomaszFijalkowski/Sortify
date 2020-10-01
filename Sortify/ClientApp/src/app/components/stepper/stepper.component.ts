import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Playlist } from 'src/app/models/get-playlists.response';
import { Options, SortableEvent } from 'sortablejs';
import { SortableGroup } from 'src/app/models/enums/sortable-group.enum';
import { SortableItem } from 'src/app/models/sortable-item';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.sass']
})

export class StepperComponent implements OnInit {
  // Select the source step
  displayedColumns: string[] = ['playlist-image', 'playlist-details'];
  dataSource = new MatTableDataSource<Playlist>();
  selection = new SelectionModel<string>(true, []);
  selectionCountText: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Choose the sorting step
  basicProperties: SortableItem[] = [
    new SortableItem('Artist name', 0, SortableGroup.BasicProperties),
    new SortableItem('Album name', 1, SortableGroup.BasicProperties),
    new SortableItem('Album release date', 2, SortableGroup.BasicProperties),
    new SortableItem('Track duration', 3, SortableGroup.BasicProperties),
    new SortableItem('Track name', 4, SortableGroup.BasicProperties),
    new SortableItem('Track number', 5, SortableGroup.BasicProperties),
    new SortableItem('Track popularity', 6, SortableGroup.BasicProperties)
  ];

  audioFeatures: SortableItem[] = [
    new SortableItem('Acousticness', 0, SortableGroup.AudioFeatures),
    new SortableItem('Danceability', 1, SortableGroup.AudioFeatures),
    new SortableItem('Energy', 2, SortableGroup.AudioFeatures),
    new SortableItem('Instrumentalness', 3, SortableGroup.AudioFeatures),
    new SortableItem('Liveness', 4, SortableGroup.AudioFeatures),
    new SortableItem('Loudness', 5, SortableGroup.AudioFeatures),
    new SortableItem('Speechiness', 6, SortableGroup.AudioFeatures),
    new SortableItem('Tempo', 7, SortableGroup.AudioFeatures),
    new SortableItem('Valence', 8, SortableGroup.AudioFeatures)
  ];

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

  // Set the output step
  outputFormGroup: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.setupDataSource();
    this.observeSelectionCount();

    this.outputFormGroup = this.formBuilder.group({
      outputCtrl: ['', Validators.required]
    });
  }

  private setupDataSource(): void {
    const data = this.activatedRoute.snapshot.data;
    this.dataSource.data = data.playlists.result.playlists;
    this.dataSource.paginator = this.paginator;
  }

  private observeSelectionCount(): void {
    this.selection.changed.subscribe(x => {
      const count = this.selection.selected.length;
      this.selectionCountText = count > 0 ? `(${count})` : '';
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSelection(): void {
    this.selection.clear();
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
        this.moveSortableItem(item, this.sortBy, this.basicProperties);
        break;
      case SortableGroup.AudioFeatures:
        this.moveSortableItem(item, this.sortBy, this.audioFeatures);
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
        this.moveSortableItem(item, this.basicProperties, this.sortBy);
        break;
      case SortableGroup.AudioFeatures:
        this.moveSortableItem(item, this.audioFeatures, this.sortBy);
        break;
    }
  }

  private createSortableItem(element: HTMLElement): SortableItem {
    const name = element.dataset['name'];
    const order = Number(element.dataset['order']);
    const initialGroup = SortableGroup[element.dataset['initialgroup']];
    return new SortableItem(name, order, initialGroup);
  }

  private moveSortableItem(item: SortableItem, from: SortableItem[], to: SortableItem[]): void {
    const index = from.findIndex(x => x.name === item.name);
    if (index > -1) {
      from.splice(index, 1);
    }
    to.push(item);
    to.sort((a, b) => a.order - b.order);
    this.changeDetector.detectChanges();
  }
}
