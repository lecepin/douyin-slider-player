/// <reference types="vite/client" />

interface IPlayListItem {
  id: number;
  path: string;
  title: string;
  poster: string;
}

interface ITimePlay {
  id: number;
  time: number;
}

interface ITimePlayMap {
  [key: number]: ITimePlay;
}
