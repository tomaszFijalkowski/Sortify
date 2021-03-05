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

export interface Image {
  height: number;
  width: number;
  url: string;
}
