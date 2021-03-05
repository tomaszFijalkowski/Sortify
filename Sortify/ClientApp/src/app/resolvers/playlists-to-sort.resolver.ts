import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetPlaylistsResponse } from '../models/responses/get-playlists.response';
import { GetUserDetailsResponse } from '../models/responses/get-user-details.response';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToSortResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private userService: UserService,
    private playlistService: PlaylistService,
    private router: Router) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.userService.getUserDetails().pipe(
      mergeMap((userDetailsResponse: OperationResult<GetUserDetailsResponse>) => {
        if (userDetailsResponse.successful) {
          const ownerId = userDetailsResponse.result.userDetails.id;
          return this.playlistService.getPlaylists(ownerId).pipe(
            map((playlistsResponse: OperationResult<GetPlaylistsResponse>) => {
              if (playlistsResponse.successful) {
                return playlistsResponse;
              }
              this.router.navigate(['/error'],
                { state: { statusCode: playlistsResponse.statusCode, errorMessage: playlistsResponse.errorMessage } });
            }));
        }
        this.router.navigate(['/error'],
          { state: { statusCode: userDetailsResponse.statusCode, errorMessage: userDetailsResponse.errorMessage } });
        return EMPTY;
      }),
      catchError(() => {
        this.router.navigate(['/error']);
        return EMPTY;
      }));
  }
}
