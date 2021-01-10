import { Playlist } from '../get-playlists.response';

export class SelectionChangedEvent {
  constructor(
    public selectedPlaylists: Playlist[]) {
  }
}
