import { EMPTY, Observable } from 'rxjs';
import { catchError, expand, finalize, reduce } from 'rxjs/operators';

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
      expand(((response: OperationResult<GetPlaylistsResponse>) => {
        if (response.successful) {
          const isFinished = response.result.isFinished;
          const index = response.result.index;
          return isFinished ? EMPTY : this.playlistService.getPlaylists(index);
        }
        return EMPTY;
      })),
      reduce((previous: OperationResult<GetPlaylistsResponse>, response: OperationResult<GetPlaylistsResponse>) => {
        if (response.successful) {
          const previousPlaylists = previous ? previous.result.playlists : [];
          const combinedPlaylists = [...previousPlaylists, ...response.result.playlists];
          response.result.playlists = combinedPlaylists;
          return response;
        }
        this.router.navigate(['/error'], { state: { statusCode: response.statusCode, errorMessage: response.errorMessage } });
      }, null),
      catchError(() => {
        this.router.navigate(['/error']);
        return EMPTY;
      }),
      finalize(() => this.loadingService.finishLoading())
    );
  }
}
