import { DokiThemeDefinition } from "./extension";

export class DokiTheme {
  name: string;
  displayName: string;
  id: string;

  constructor(dokiThemeDefinition: DokiThemeDefinition) {
    this.name = dokiThemeDefinition.information.name;
    this.displayName = dokiThemeDefinition.information.displayName;
    this.id = dokiThemeDefinition.information.id;
  }
}

export enum StickerType {
  DEFAULT= "DEFAULT", SECONDARY = "SECONDARY"
}

export interface DokiSticker {
  type: StickerType;
  sticker: Sticker;
}

export interface Sticker {
  path: string;
  name: string;
  anchoring: string;
}
