export class CreatePlaylistsRequest {
  constructor(
    public playlistIds: string[],
    public sortBy: SortByItem[],
    public dontBreak: boolean,
    public breakType: string,
    public name: string,
    public numberingPlacement: string,
    public numberingStyle: string,
    public description: string,
    public isSecret: boolean,
    public splitByTracksNumber?: number,
    public splitByPlaylistsNumber?: number) {
  }
}

export class SortByItem {
  constructor(
    public name: string,
    public order: 'asc' | 'desc') {
  }
}
