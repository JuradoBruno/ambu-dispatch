import { Injectable } from '@angular/core';
import { ICoordinates } from '../../models/Coordinates.model';

@Injectable()
export class CoordinatesService {
    calculateDistance(target: ICoordinates, origin: ICoordinates) {
        let lat1 = target.x
        let lon1 = target.y
        let originLat2 = origin.x
        let originLon2 = origin.y
        const Radius = 6378000 // km
        const dLat = this.toRad(originLat2 - lat1)
        const dLon = this.toRad(originLon2 - lon1)
        const lat1Assign = this.toRad(lat1)
        const lat2Assign = this.toRad(originLat2)

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1Assign) *
            Math.cos(lat2Assign)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = Radius * c
        return Math.ceil(distance) // m
    }
    // Converts numeric degrees to radians
    toRad(Value) {
        return (Value * Math.PI) / 180
    }
}