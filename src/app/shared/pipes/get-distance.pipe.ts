import { Pipe, PipeTransform } from '@angular/core';
import { ICoordinates } from '../../models/Coordinates.model';
import { CoordinatesService } from '../services/coordinates.service';

@Pipe({name: 'getDistance'})
export class GetDistancePipe implements PipeTransform {
    constructor(private coordinatesService: CoordinatesService) {

    }
    
    transform(origin: ICoordinates, target: ICoordinates): any {
        let distance = this.coordinatesService.calculateDistance(target, origin)
        if (distance < 1000) return `${distance} m`
        return `${distance / 1000} km`
    }
}