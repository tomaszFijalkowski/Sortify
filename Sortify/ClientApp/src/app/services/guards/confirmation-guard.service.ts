import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { RequestState } from 'src/app/models/enums/request-state.enum';

@Injectable()
export class ConfirmationGuardService implements CanDeactivate<any> {

  constructor() {}

  canDeactivate(component: any): boolean {
    if (component.request.state === RequestState.InProgress) {
      return confirm('Changes you made may not be saved.');
    }
    return true;
  }
}
