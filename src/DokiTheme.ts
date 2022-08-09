import { DokiThemeDefinition } from "./extension";

export const ZERO_TWO_OBSIDIAN_ID = '13adffd9-acbe-47af-8101-fa71269a4c5c'; 
export const DEFAULT_THEME_ID = ZERO_TWO_OBSIDIAN_ID; 

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
