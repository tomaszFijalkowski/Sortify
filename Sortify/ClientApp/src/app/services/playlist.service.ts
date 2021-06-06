import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
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

  getPlaylists(index: number = 0, ownerId: string = null): Observable<OperationResult<GetPlaylistsResponse>> {
    const params = this.createHttpParams({ index: index, ownerId: ownerId });
    return this.http.get<OperationResult<GetPlaylistsResponse>>(this.baseUrl + 'playlist', { params: params });
  }

  private createHttpParams(params: {}): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(param => {
      if (params[param]) {
        httpParams = httpParams.set(param, params[param]);
      }
    });

    return httpParams;
  }

  sortPlaylists(request: SortPlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.baseUrl + 'playlist/sort', request);
  }

  createPlaylists(request: CreatePlaylistsRequest): Observable<OperationResult<Nothing>> {
    return this.http.post<OperationResult<Nothing>>(this.baseUrl + 'playlist/create', request);
  }
}
