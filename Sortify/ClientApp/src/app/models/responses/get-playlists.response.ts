export interface GetPlaylistsResponse {
  playlists: Playlist[];
  isFinished: boolean;
  index: number;
}

export interface Playlist {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  size: number;
  image: Image;
  index: number;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}
