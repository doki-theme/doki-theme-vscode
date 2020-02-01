export class DokiTheme {
  name: string;
  sticker: Sticker;

  constructor(name: string, sticker: Sticker) {
    this.name = name;
    this.sticker = sticker;
  }
}

export interface Sticker {
  url: string;
}