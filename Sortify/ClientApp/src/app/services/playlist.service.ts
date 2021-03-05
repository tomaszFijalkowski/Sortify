import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { CreatePlaylistsRequest } from '../models/requests/create-playlists.request';
import { SortPlaylistsRequest } from '../models/requests/sort-playlists.request';
import { OperationResult } from '../models/responses/base/operation-result';
import { GetPlaylistsResponse } from '../models/responses/get-playlists.response';
import { Nothing } from '../models/responses/nothing';

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
