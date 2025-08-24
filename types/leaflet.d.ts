declare module 'leaflet' {
  export interface MapOptions {
    center: [number, number];
    zoom: number;
  }

  export interface TileLayerOptions {
    maxZoom?: number;
    attribution?: string;
  }

  export interface IconOptions {
    iconUrl?: string;
    iconRetinaUrl?: string;
    shadowUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    shadowSize?: [number, number];
    shadowAnchor?: [number, number];
    className?: string;
  }

  export interface DivIconOptions {
    className?: string;
    html?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
  }

  export interface ControlOptions {
    position?: string;
  }

  export interface ZoomOptions extends ControlOptions {
    position?: string;
  }

  export interface ScaleOptions extends ControlOptions {
    position?: string;
    metric?: boolean;
    imperial?: boolean;
  }

  export class Map {
    constructor(element: HTMLElement, options?: MapOptions);
    setView(center: [number, number], zoom: number): Map;
    remove(): void;
  }

  export class TileLayer {
    constructor(urlTemplate: string, options?: TileLayerOptions);
    addTo(map: Map): TileLayer;
  }

  export class Marker {
    constructor(latlng: [number, number], options?: any);
    addTo(map: Map): Marker;
    bindPopup(content: string): Marker;
  }

  export class Icon {
    static Default: {
      prototype: {
        _getIconUrl?: () => string;
      };
      mergeOptions(options: IconOptions): void;
    };
    constructor(options: IconOptions);
  }

  export class DivIcon {
    constructor(options: DivIconOptions);
  }

  export namespace control {
    function zoom(options?: ZoomOptions): any;
    function scale(options?: ScaleOptions): any;
  }

  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
  export function marker(latlng: [number, number], options?: any): Marker;
  export function divIcon(options?: DivIconOptions): DivIcon;

  const L: {
    Map: typeof Map;
    TileLayer: typeof TileLayer;
    Marker: typeof Marker;
    Icon: typeof Icon;
    DivIcon: typeof DivIcon;
    control: typeof control;
    tileLayer: typeof tileLayer;
    marker: typeof marker;
    divIcon: typeof divIcon;
  };

  export default L;
}
