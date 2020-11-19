import { SortableGroup } from './enums/sortable-group.enum';

export class SortableItem {
  constructor(
    public name: string,
    public value: string,
    public order: 'asc' | 'desc',
    public initialIndex: number,
    public initialGroup: SortableGroup) {
  }
}
