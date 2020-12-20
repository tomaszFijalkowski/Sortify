import { RequestState } from './enums/request-state.enum';

export class RequestDetails {
  constructor(public state: RequestState,
    public progress: number,
    public description: string) {
  }
}
