import { DokiThemeDefinition } from "./extension";

export class DokiTheme {
  name: string;
  displayName: string;
  sticker: Sticker;
  id: string;

  constructor(dokiThemeDefinition: DokiThemeDefinition) {
    this.name = dokiThemeDefinition.information.name;
    this.displayName = dokiThemeDefinition.information.displayName;
    this.id = dokiThemeDefinition.information.id;
    this.sticker = {
      url: dokiThemeDefinition.sticker.url,
      name: dokiThemeDefinition.sticker.name
    };
  }
}

export interface Sticker {
  url: string;
  name: string;
}