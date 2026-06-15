"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GeolocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GeolocationService = GeolocationService_1 = class GeolocationService {
    logger = new common_1.Logger(GeolocationService_1.name);
    async geocodeAddress(address, city, state) {
        try {
            const queryParts = [address];
            if (city)
                queryParts.push(city);
            if (state)
                queryParts.push(state);
            const query = queryParts.join(', ');
            const response = await axios_1.default.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'ClickMarido-ERP/1.0',
                },
            });
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon),
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Erro ao geocodificar o endereço: ${address}`, error.stack);
            return null;
        }
    }
    calculateDistance(coord1, coord2) {
        const R = 6371;
        const dLat = this.deg2rad(coord2.lat - coord1.lat);
        const dLng = this.deg2rad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(coord1.lat)) *
                Math.cos(this.deg2rad(coord2.lat)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = GeolocationService_1 = __decorate([
    (0, common_1.Injectable)()
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map