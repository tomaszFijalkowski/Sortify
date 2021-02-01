import { Observable } from 'rxjs';

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
    const ownerId = this.userService.currentUserDetails.id;
    return this.playlistService.getPlaylists(ownerId);
  }
}
