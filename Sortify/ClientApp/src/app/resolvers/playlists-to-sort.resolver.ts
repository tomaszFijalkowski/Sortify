import { EMPTY, Observable } from 'rxjs';
import { catchError, expand, finalize, mergeMap, reduce } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { OperationResult } from '../models/responses/base/operation-result';
import { GetPlaylistsResponse } from '../models/responses/get-playlists.response';
import { GetUserDetailsResponse } from '../models/responses/get-user-details.response';
import { LoadingService } from '../services/loading.service';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToSortResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private userService: UserService,
    private playlistService: PlaylistService,
    private loadingService: LoadingService,
    private router: Router) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    this.loadingService.startLoading();
    return this.userService.getUserDetails(false).pipe(
      mergeMap((userDetailsResponse: OperationResult<GetUserDetailsResponse>) => {
        if (userDetailsResponse.successful) {
          const ownerId = userDetailsResponse.result.userDetails.id;
          return this.playlistService.getPlaylists(0, ownerId).pipe(
            expand(((response: OperationResult<GetPlaylistsResponse>) => {
              if (response.successful) {
                const isFinished = response.result.isFinished;
                const index = response.result.index;
                return isFinished ? EMPTY : this.playlistService.getPlaylists(index, ownerId);
              }
              return EMPTY;
            })),
            reduce((previous: OperationResult<GetPlaylistsResponse>, response: OperationResult<GetPlaylistsResponse>) => {
              if (response.successful) {
                const previousPlaylists = previous ? previous.result.playlists : [];
                const combinedPlaylists = [...previousPlaylists, ...response.result.playlists];

                let index = 0;
                combinedPlaylists.forEach(x => x.index = index++);

                response.result.playlists = combinedPlaylists;
                return response;
              }
              this.router.navigate(['/error'], { state: { statusCode: response.statusCode, errorMessage: response.errorMessage } });
            }, null));
        }
        this.router.navigate(['/error'],
          { state: { statusCode: userDetailsResponse.statusCode, errorMessage: userDetailsResponse.errorMessage } });
        return EMPTY;
      }),
      catchError(() => {
        this.router.navigate(['/error']);
        return EMPTY;
      }),
      finalize(() => this.loadingService.finishLoading())
    );
  }
}
