import { MissionToUser } from './Mission.model'
import { VehicleToUserBuilding } from './Vehicle.model'

export class EngageVehiclesToMissionDto {    
    vehiclesToUserBuilding: VehicleToUserBuilding[]
    missionToUser: MissionToUser
}