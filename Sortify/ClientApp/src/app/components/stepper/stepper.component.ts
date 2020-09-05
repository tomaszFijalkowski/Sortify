import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Playlist } from 'src/app/models/get-playlists.response';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.sass']
})

export class StepperComponent implements OnInit {
  isLinear = false;
  sortFormGroup: FormGroup;
  outputFormGroup: FormGroup;

  displayedColumns: string[] = ['playlist-image', 'playlist-details'];
  dataSource = new MatTableDataSource<Playlist>();
  selection = new SelectionModel<string>(true, []);
  selectionCount: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.setupDataSource();
    this.observeSelectionCount();

    this.sortFormGroup = this.formBuilder.group({
      sortCtrl: ['', Validators.required]
    });

    this.outputFormGroup = this.formBuilder.group({
      outputCtrl: ['', Validators.required]
    });
  }

  private setupDataSource(): void {
    const data = this.activatedRoute.snapshot.data;
    this.dataSource.data = data.playlists.result.playlists;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.data);
  }

  private observeSelectionCount(): void {
    this.selection.changed.subscribe(x => {
      const count = this.selection.selected.length;
      this.selectionCount = count > 0 ? `(${count})` : '';
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.selection);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(playlist => this.selection.select(playlist.id));
  }
}
