import { Image } from './image';

export interface GetUserDetailsResponse {
  userDetails: UserDetails;
}

export interface UserDetails {
  displayName: string;
  image: Image;
}
