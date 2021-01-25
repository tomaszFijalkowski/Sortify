import 'lodash';

import { CreationForm, CreationFormChangedEvent } from 'src/app/models/events/creation-form-changed.event';

import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SmartSplitHelpComponent } from './smart-split-help/smart-split-help.component';

declare const _: any;

@Component({
  selector: 'app-creation-step',
  templateUrl: './creation-step.component.html',
  styleUrls: ['./creation-step.component.sass']
})
export class CreationStepComponent implements OnInit, AfterViewInit {
  readonly splitByTracksMinNumber = 20;
  readonly splitByTracksMaxNumber = 10000;
  readonly splitByPlaylistsMinNumber = 2;
  readonly splitByPlaylistsMaxNumber = 100;

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

  formGroup: FormGroup;

  splitByTracksSelected = false;
  splitByPlaylistsSelected = false;

  @ViewChild('splitByTracksInput', {static: true}) splitByTracksInput: ElementRef;
  @ViewChild('splitByPlaylistsInput', {static: true}) splitByPlaylistsInput: ElementRef;

  selectedNumberingPlacement: 'before' | 'after';
  selectedNumberingStyle: string;

  @Output() formChanged = new EventEmitter();

  constructor(private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildFormGroup();
    this.onFormChanged();
  }

  ngAfterViewInit() {
    this.selectedNumberingPlacement = 'before';
    this.changeDetector.detectChanges();
  }

  private onFormChanged(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.formChanged.next(new CreationFormChangedEvent(
        new CreationForm(
          this.formGroup.get('smartSplit').value,
          this.formGroup.get('smartSplit').value ? this.formGroup.get('smartSplitType').value : null,
          this.formGroup.get('name').value,
          this.selectedNumberingStyle ? this.formGroup.get('numberingPlacement').value : null,
          this.formGroup.get('numberingStyle').value,
          this.formGroup.get('description').value,
          this.formGroup.get('isSecret').value,
          this.splitByTracksSelected ? this.formGroup.get('splitByTracksNumber').value : null,
          this.splitByPlaylistsSelected ? this.formGroup.get('splitByPlaylistsNumber').value : null
        ),
        this.formGroup.valid,
        this.splitByTracksSelected || this.splitByPlaylistsSelected
      ));
    });
  }

  private buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      splitByTracksNumber: new FormControl(200,
        [Validators.required, Validators.min(this.splitByTracksMinNumber), Validators.max(this.splitByTracksMaxNumber)]),
      splitByPlaylistsNumber: new FormControl(2,
        [Validators.required, Validators.min(this.splitByPlaylistsMinNumber), Validators.max(this.splitByPlaylistsMaxNumber)]),
      smartSplit: new FormControl({value: false, disabled: true}),
      smartSplitType: new FormControl({value: 'albums', disabled: true}),
      name: new FormControl(null, [Validators.required, Validators.maxLength(this.nameMaxLength)]),
      numberingPlacement: new FormControl('before'),
      numberingStyle: new FormControl({value: null, disabled: true}),
      description: new FormControl(null, [Validators.maxLength(this.descriptionMaxLength)]),
      isSecret: new FormControl(false)
    });
  }

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

  openSmartSplitHelp(): void {
    this.dialog.open(SmartSplitHelpComponent, {
      width: '520px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      autoFocus: false
    });
  }
}
