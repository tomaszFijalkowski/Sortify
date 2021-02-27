import { clamp } from 'lodash';
import { CreationForm, CreationFormChangedEvent } from 'src/app/models/events/creation-form-changed.event';
import { BREAKPOINT_PHONE, BREAKPOINT_TABLET } from 'src/app/models/resolution-breakpoints';

import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SmartSplitHelpComponent } from './smart-split-help/smart-split-help.component';

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

  form: FormGroup;
  isFormPristine = true;

  splitByTracksSelected = false;
  splitByPlaylistsSelected = false;

  @ViewChild('splitByTracksInput', {static: true}) splitByTracksInput: ElementRef;
  @ViewChild('splitByPlaylistsInput', {static: true}) splitByPlaylistsInput: ElementRef;

  selectedNumberingPlacement: 'before' | 'after';
  selectedNumberingStyle: string = null;

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
    this.prepareValidation();
  }

  private prepareValidation(): void {
    this.form.get('name').setErrors(null);
    this.form.get('splitByTracksNumber').markAsTouched();
    this.form.get('splitByPlaylistsNumber').markAsTouched();
    this.changeDetector.detectChanges();
  }

  private buildFormGroup(): void {
    this.form = this.formBuilder.group({
      splitByTracksNumber: new FormControl(200,
        [Validators.required, Validators.min(this.splitByTracksMinNumber), Validators.max(this.splitByTracksMaxNumber)]),
      splitByPlaylistsNumber: new FormControl(2,
        [Validators.required, Validators.min(this.splitByPlaylistsMinNumber), Validators.max(this.splitByPlaylistsMaxNumber)]),
      smartSplit: new FormControl({value: false, disabled: true}),
      smartSplitType: new FormControl({value: 'albums', disabled: true}),
      name: new FormControl(null, [Validators.maxLength(this.nameMaxLength)]),
      numberingPlacement: new FormControl({value: 'before', disabled: true}),
      numberingStyle: new FormControl({value: null, disabled: true}),
      description: new FormControl(null, [Validators.maxLength(this.descriptionMaxLength)]),
      isSecret: new FormControl(false)
    });
  }

  private onFormChanged(): void {
    this.form.valueChanges.subscribe(() => {
      this.formChanged.next(new CreationFormChangedEvent(
        new CreationForm(
          this.form.get('smartSplit').value,
          this.form.get('smartSplit').value ? this.form.get('smartSplitType').value : null,
          this.form.get('name').value,
          this.selectedNumberingStyle ? this.form.get('numberingPlacement').value : null,
          this.form.get('numberingStyle').value,
          this.form.get('description').value,
          this.form.get('isSecret').value,
          this.splitByTracksSelected ? this.form.get('splitByTracksNumber').value : null,
          this.splitByPlaylistsSelected ? this.form.get('splitByPlaylistsNumber').value : null
        ),
        this.form.valid && this.form.get('name').value ? true : false,
        this.splitByTracksSelected || this.splitByPlaylistsSelected
      ));
      this.isFormPristine = this.checkFormInitialValues();
    });
  }

  private checkFormInitialValues(): boolean {
    const rawForm = this.form.getRawValue();

    return this.splitByTracksSelected === false &&
      this.splitByPlaylistsSelected === false &&
      rawForm.smartSplit === false &&
      rawForm.smartSplitType === 'albums' &&
      (rawForm.name ? false : true) &&
      rawForm.numberingPlacement === 'before' &&
      rawForm.numberingStyle === null &&
      (rawForm.description ? false : true) &&
      rawForm.isSecret === false &&
      rawForm.splitByTracksNumber === 200 &&
      rawForm.splitByPlaylistsNumber === 2;
  }

  get gridCols(): number {
    return window.innerWidth > BREAKPOINT_PHONE ? 2 : 1;
  }

  get gutterSize(): number {
    return window.innerWidth > BREAKPOINT_TABLET ? 24 : window.innerWidth > BREAKPOINT_PHONE ? 20 : 16;
  }

  resetForm(): void {
    this.splitByTracksSelected = false;
    this.splitByPlaylistsSelected = false;
    this.selectedNumberingStyle = null;

    this.form.reset({
      splitByTracksNumber: 200,
      splitByPlaylistsNumber: 2,
      smartSplit: {value: false, disabled: true},
      smartSplitType: {value: 'albums', disabled: true},
      numberingPlacement: {value: 'before', disabled: true},
      numberingStyle: {value: null, disabled: true},
      isSecret: false
    });

    this.prepareValidation();
    this.isFormPristine = true;
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
      this.form.controls['smartSplit'].enable();
      this.form.controls['smartSplitType'].enable();
    } else {
      this.form.controls['smartSplit'].disable();
      this.form.controls['smartSplitType'].disable();
      this.form.patchValue({
        smartSplit: false
      });
    }
  }

  private toggleNumberingSelect(): void {
    if (this.splitByTracksSelected || this.splitByPlaylistsSelected) {
      this.form.controls['numberingStyle'].enable();
      this.form.controls['numberingPlacement'].enable();
    } else {
      this.form.controls['numberingStyle'].disable();
      this.form.controls['numberingPlacement'].disable();
      this.form.patchValue({
        numberingStyle: null
      });
      this.selectedNumberingStyle = null;
    }
  }

  onSplitByTracksInputClick(event: MouseEvent): void {
    if (this.splitByTracksSelected) {
      event.stopPropagation();
    }
  }

  onSplitByTracksInputBlur(value: number): void {
    this.form.patchValue({
      splitByTracksNumber: clamp(value, this.splitByTracksMinNumber, this.splitByTracksMaxNumber)
    });
  }

  onSplitByPlaylistsInputClick(event: MouseEvent): void {
    if (this.splitByPlaylistsSelected) {
      event.stopPropagation();
    }
  }

  onSplitByPlaylistsInputBlur(value: number): void {
    this.form.patchValue({
      splitByPlaylistsNumber: clamp(value, this.splitByPlaylistsMinNumber, this.splitByPlaylistsMaxNumber)
    });
  }

  openSmartSplitHelp(): void {
    this.dialog.open(SmartSplitHelpComponent, {
      width: '520px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }
}
