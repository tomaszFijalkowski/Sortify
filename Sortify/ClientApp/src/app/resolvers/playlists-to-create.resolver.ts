import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { OperationResult } from '../models/operation-result';
import { PlaylistService } from '../services/playlist.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsToCreateResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private playlistService: PlaylistService) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.playlistService.getPlaylists();
  }
}
