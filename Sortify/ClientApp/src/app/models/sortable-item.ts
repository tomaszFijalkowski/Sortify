import { SortableGroup } from './enums/sortable-group.enum';

export class SortableItem {
  constructor(
    public name: string,
    public order: number,
    public initialGroup: SortableGroup) {
  }
}
