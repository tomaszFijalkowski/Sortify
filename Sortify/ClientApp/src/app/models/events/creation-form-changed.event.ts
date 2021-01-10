export class CreationFormChangedEvent {
  constructor(
    public creationForm: CreationForm,
    public creationFormValid: boolean,
    public creatingMultiplePlaylists: boolean) {
  }
}

export class CreationForm {
  constructor(
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
