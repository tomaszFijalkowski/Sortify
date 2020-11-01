import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetPlaylistsResponse } from '../models/get-playlists.response';
import { OperationResult } from '../models/operation-result';
import { Observable } from 'rxjs';
import { Nothing } from '../models/nothing';
import { CreatePlaylistsRequest } from '../models/create-playlists.request';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  readonly tempBaseUrl = 'https://localhost:44362/';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  getPlaylists(): Observable<OperationResult<GetPlaylistsResponse>> {
    return this.http.get<OperationResult<GetPlaylistsResponse>>(this.tempBaseUrl + 'playlist');
  }

  createPlaylists(request: CreatePlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.tempBaseUrl + 'playlist/create', request);
  }
}
