import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Mission } from '../../models/Mission.model';
import { VehicleToUserBuilding } from '../../models/Vehicle.model';
import { EngageVehiclesToMissionDto } from '../../models/dtos';

@Injectable()
export class VehiclesService {
    vehiclesUrl = 'vehicles'
    constructor(
        private baseHttp: BaseHttpService,
    ) { }

    engageVehicles(missionToUser: Mission, vehiclesToUserBuilding: VehicleToUserBuilding[]) {
        return this.baseHttp.post<EngageVehiclesToMissionDto>(this.vehiclesUrl + '/engage-to-mission', { missionToUser, vehiclesToUserBuilding })
        .then((engageVehiclesToMissionDto: EngageVehiclesToMissionDto) => {
            return engageVehiclesToMissionDto
        })
    }
}