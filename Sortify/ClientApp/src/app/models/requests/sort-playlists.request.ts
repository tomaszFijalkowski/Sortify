export class SortPlaylistsRequest {
  constructor(
    public connectionId: string,
    public taskWeight: number,
    public playlistIds: string[],
    public sortBy: string[],
    public sortByAudioFeatures: boolean) {
  }
}
