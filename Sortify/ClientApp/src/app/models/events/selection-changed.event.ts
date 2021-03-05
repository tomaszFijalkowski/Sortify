import { Playlist } from '../responses/get-playlists.response';

export class SelectionChangedEvent {
  constructor(
    public selectedPlaylists: Playlist[]) {
  }
}
