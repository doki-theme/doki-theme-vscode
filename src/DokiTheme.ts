import { DokiThemeDefinition } from "./extension";

export class DokiTheme {
  name: string;
  displayName: string;
  sticker: Sticker;

  constructor(dokiThemeDefinition: DokiThemeDefinition) {
    this.name = dokiThemeDefinition.information.name;
    this.displayName = dokiThemeDefinition.information.displayName;
    this.sticker = {
      url: dokiThemeDefinition.sticker
    };
  }
}

export interface Sticker {
  url: string;
}