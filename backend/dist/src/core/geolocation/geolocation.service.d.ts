export interface Coordinates {
    lat: number;
    lng: number;
}
export declare class GeolocationService {
    private readonly logger;
    geocodeAddress(address: string, city?: string, state?: string): Promise<Coordinates | null>;
    calculateDistance(coord1: Coordinates, coord2: Coordinates): number;
    private deg2rad;
}
