import { RequestState } from 'src/app/models/enums/request-state.enum';
import { RequestDetails } from 'src/app/models/request-details';

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-end-step',
  templateUrl: './end-step.component.html',
  styleUrls: ['./end-step.component.sass']
})
export class EndStepComponent implements OnInit {
  readonly progressComplete = 100;

  State = RequestState;

  @Input() request: RequestDetails;
  @Input() header: string;
  @Input() blockCancellation = false;
  @Output() cancelRequest = new EventEmitter();
  @Output() backToStepper = new EventEmitter();

  mouseOverCancel: boolean;

  constructor() {
  }

  ngOnInit() {
    this.request.state = RequestState.Ready;
  }

  onCancelClick(): void {
    this.cancelRequest.next();
  }

  onBackClick(): void {
    this.backToStepper.next();
    this.mouseOverCancel = false;
  }

  onMouseOverCancel(flag: boolean): void {
    this.mouseOverCancel = flag;
  }

  get progressSpinnerCancel(): boolean {
    const mouseOverCancel = this.mouseOverCancel && this.request.state === this.State.InProgress && !this.blockCancellation;
    return mouseOverCancel || this.request.state === this.State.Cancelled;
  }

  @HostListener('window:beforeunload', ['$event'])
  onUnload($event: any) {
    if (this.request.state === RequestState.InProgress) {
      $event.returnValue = true;
    }
  }
}
