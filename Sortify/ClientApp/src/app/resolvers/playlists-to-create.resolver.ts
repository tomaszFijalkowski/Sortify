import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { OperationResult } from '../models/operation-result';
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
