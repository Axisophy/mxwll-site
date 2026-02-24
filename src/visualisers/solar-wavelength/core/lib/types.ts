export interface AIAChannel {
  wavelength: number;
  sourceId: number;
  layer: string;
  name: string;
  colour: string;
  falseName: string;
  temperature: string;
  temperatureK: number;
  region: string;
  description: string;
  reveals: string;
  ion: string;
}

export interface ImageCache {
  [wavelength: number]: HTMLImageElement;
}
