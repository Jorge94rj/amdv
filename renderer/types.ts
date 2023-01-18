
export const dayNames = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday',
}

export interface NextAuthUser {
  name: string |undefined;
  email: string | undefined;
  image: string | undefined;
}

export interface SessionUser extends NextAuthUser {
  username: string;
}

export interface ResponseData {
  success?: boolean;
  error?: unknown;
  message?: string;
};

export type AssetType = 'image' | 'model';

export interface IChannel {
  id: number;
  name: string;
}

export interface IDay {
  id: number;
  day: number;
  channel_id: number;
}

export interface IBlock {
  id?: number;
  name?: string;
  start_time?: string;
  // path?: string;
  len?: number;
  channel_id?: number | undefined;
  day_id?: number | undefined;
}

export interface IMedia {
  id?:number;
  block_id?: number;
  path: string;
  fullpath: string;
  filename: string;
  duration: number;
  played: number;
}

export interface FileResponseData extends ResponseData {
  fileName: string;
  path: string;
}

export enum StatusCode {
  success = 200,
  fail = 500,
}

export interface HandleEventChangeInterface {
  target: HTMLInputElement | HTMLSelectElement;
}