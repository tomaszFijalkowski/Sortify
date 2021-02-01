import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { CreatePlaylistsRequest } from '../models/create-playlists.request';
import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { Nothing } from '../models/nothing';
import { OperationResult } from '../models/operation-result';
import { SortPlaylistsRequest } from '../models/sort-playlists.request';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getPlaylists(ownerId: string = null): Observable<OperationResult<GetPlaylistsResponse>> {
    const params = { params: ownerId ? {ownerId: ownerId} : null };
    return this.http.get<OperationResult<GetPlaylistsResponse>>(this.baseUrl + 'playlist', params);
  }

  sortPlaylists(request: SortPlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.baseUrl + 'playlist/sort', request);
  }

  createPlaylists(request: CreatePlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.baseUrl + 'playlist/create', request);
  }
}
