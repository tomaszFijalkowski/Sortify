import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetPlaylistsResponse } from '../models/responses/get-playlists.response';
import { PlaylistService } from '../services/playlist.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToCreateResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private playlistService: PlaylistService,
    private router: Router) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
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
      }));
  }
}
