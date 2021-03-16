import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetPlaylistsResponse } from '../models/responses/get-playlists.response';
import { LoadingService } from '../services/loading.service';
import { PlaylistService } from '../services/playlist.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToCreateResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private playlistService: PlaylistService,
    private loadingService: LoadingService,
    private router: Router) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    this.loadingService.startLoading();
    return this.playlistService.getPlaylists().pipe(
      map((response: OperationResult<GetPlaylistsResponse>) => {
        if (response.successful) {
          return response;
        }
        this.router.navigate(['/error'], { state: { statusCode: response.statusCode, errorMessage: response.errorMessage } });
      }),
      catchError(() => {
        this.router.navigate(['/error']);
        return EMPTY;
      }),
      finalize(() => this.loadingService.finishLoading())
    );
  }
}
