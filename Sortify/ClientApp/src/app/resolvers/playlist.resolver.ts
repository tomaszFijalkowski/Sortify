import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs';
import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { OperationResult } from '../models/operation-result';

@Injectable({ providedIn: 'root' })
export class PlaylistResolver implements Resolve<OperationResult<GetPlaylistsResponse>> {
  constructor(private playlistService: PlaylistService) {
  }

  resolve(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.playlistService.getPlaylists();
  }
}
