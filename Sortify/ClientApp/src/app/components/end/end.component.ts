import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { RequestState } from 'src/app/models/enums/request-state.enum';
import { RequestDetails } from 'src/app/models/request-details';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.sass']
})
export class EndComponent implements OnInit {
  readonly progressComplete = 100;

  State = RequestState;
  @Input() request: RequestDetails;
  @Input() multiplePlaylists: boolean;
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
    return (this.mouseOverCancel && this.request.state === this.State.InProgress) || this.request.state === this.State.Cancelled;
  }

  @HostListener('window:beforeunload', ['$event'])
  onUnload($event: any) {
    if (this.request.state === RequestState.InProgress) {
      $event.returnValue = true;
    }
  }
}
