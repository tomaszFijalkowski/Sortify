import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { CreatePlaylistsRequest } from '../models/create-playlists.request';
import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { Nothing } from '../models/nothing';
import { OperationResult } from '../models/operation-result';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getPlaylists(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.http.get<OperationResult<GetPlaylistsResponse>>(this.baseUrl + 'playlist');
  }

  createPlaylists(request: CreatePlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.baseUrl + 'playlist/create', request);
  }
}
