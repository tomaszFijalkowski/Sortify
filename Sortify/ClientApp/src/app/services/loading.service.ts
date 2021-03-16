
import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading = this._isLoading.asObservable();

  constructor() {
  }

  startLoading(): void {
    this._isLoading.next(true);
  }

  finishLoading(): void {
    this._isLoading.next(false);
  }
}
