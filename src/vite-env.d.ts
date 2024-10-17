/// <reference types="vite/client" />

interface IPlayListItem {
  id: number;
  url: string;
  name: string;
  poster: string;
}

interface ITimePlay {
  id: number;
  time: number;
}

interface ITimePlayMap {
  [key: number]: ITimePlay;
}
