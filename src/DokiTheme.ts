import { DokiThemeDefinition } from "./extension";

export class DokiTheme {
  name: string;
  displayName: string;
  defaultSticker: Sticker;
  id: string;

  constructor(dokiThemeDefinition: DokiThemeDefinition) {
    this.name = dokiThemeDefinition.information.name;
    this.displayName = dokiThemeDefinition.information.displayName;
    this.id = dokiThemeDefinition.information.id;
    this.defaultSticker = {
      path: dokiThemeDefinition.stickers.default.path,
      name: dokiThemeDefinition.stickers.default.name
    };
  }
}

export interface Sticker {
  path: string;
  name: string;
}