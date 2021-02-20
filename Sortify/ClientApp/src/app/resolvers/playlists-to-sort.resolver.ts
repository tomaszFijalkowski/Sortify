import { Observable } from 'rxjs/internal/Observable';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { OperationResult } from '../models/operation-result';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToSortResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private userService: UserService,
    private playlistService: PlaylistService) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.userService.getUserDetails().pipe(mergeMap(response => {
      const ownerId = response.result.userDetails.id;
      return this.playlistService.getPlaylists(ownerId);
    }));
  }
}
