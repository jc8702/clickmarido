import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);

  /**
   * Obtém coordenadas latitude/longitude a partir de um endereço usando OpenStreetMap (Nominatim).
   * Note: A API do Nominatim exige um User-Agent válido.
   */
  async geocodeAddress(
    address: string,
    city?: string,
    state?: string,
  ): Promise<Coordinates | null> {
    try {
      // Monta a query, priorizando cidade/estado se disponíveis para maior precisão
      const queryParts = [address];
      if (city) queryParts.push(city);
      if (state) queryParts.push(state);
      const query = queryParts.join(', ');

      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'ClickMarido-ERP/1.0',
          },
        },
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Erro ao geocodificar o endereço: ${address}`,
        (error as Error).stack,
      );
      return null;
    }
  }

  /**
   * Calcula a distância (em km) entre dois pontos usando a fórmula de Haversine.
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLng = this.deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
