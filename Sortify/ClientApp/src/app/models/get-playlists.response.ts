import { Image } from './image';

export interface GetPlaylistsResponse {
  playlists: Playlist[];
}

export interface Playlist {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  size: number;
  image: Image;
}
