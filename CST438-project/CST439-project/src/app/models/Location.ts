import { User } from './User';

export class Location {
  
  _id: string;
  activity: string;
  address: string;
  coords : {
    lat: number,
    lng: number
  };
  date: Date;
  name: string;
  players: [User];
  windowIsOpen: boolean;
  icon: string;
}