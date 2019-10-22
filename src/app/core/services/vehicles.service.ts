import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseHttpService } from './base-http.service';
import { ModalService } from '../modal/modal.service';
import { Mission } from '../../models/Mission.model';
import { VehicleToUserBuilding } from '../../models/Vehicle.model';
import { HttpClient } from '@angular/common/http';
import { EngageVehiclesToMissionDto } from '../../models/dtos';

@Injectable()
export class VehiclesService {
    baseUrl = environment.baseUrl
    vehiclesUrl = this.baseUrl + 'vehicles'
    constructor(
        private http: HttpClient,
        private baseHttpService: BaseHttpService,
        private modal: ModalService
    ) { }

    engageVehicles(missionToUser: Mission, vehiclesToUserBuilding: VehicleToUserBuilding[]) {
        let headers = this.baseHttpService.returnHeaders()
        return this.http.post(this.vehiclesUrl + '/engage-to-mission', { missionToUser, vehiclesToUserBuilding }, { headers }).toPromise().then((engageVehiclesToMissionDto: EngageVehiclesToMissionDto) => {
            console.log("TCL: VehiclesService -> engageVehicles -> engageVehiclesToMissionDto", engageVehiclesToMissionDto)
        }).catch(error => this.handleError(error))
    }

    handleError(error) {
        let header = "Erreur" + error.error.statusCode
            this.modal.show({
                header,
                body: error.error.message,
                cancelButtonVisible: false
            })
    }
}