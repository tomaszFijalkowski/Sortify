export class CreatePlaylistsRequest {
  constructor(
    public playlistIds: string[],
    public sortBy: string[],
    public sortByAudioFeatures: boolean,
    public smartSplit: boolean,
    public smartSplitType: string,
    public name: string,
    public numberingPlacement: string,
    public numberingStyle: string,
    public description: string,
    public isSecret: boolean,
    public splitByTracksNumber?: number,
    public splitByPlaylistsNumber?: number) {
  }
}
