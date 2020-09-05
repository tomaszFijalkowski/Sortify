export interface GetPlaylistsResponse {
  playlists: Playlist[];
}

export interface Playlist {
  id: string;
  name: string;
  owner: string;
  size: number;
  image: Image;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}
