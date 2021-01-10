import { SortableItem } from '../sortable-item';

export class SortByChangedEvent {
  constructor(
    public sortBy: SortableItem[],
    public sortByAudioFeatures: boolean) {
  }
}
