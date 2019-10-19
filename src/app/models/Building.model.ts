import { VehicleToUserBuilding } from './Vehicle.model'
import { ICoordinates } from './Coordinates.model'

export class Building{
    buildingCore: {
        title: string,
        description: string
    }
    id: number    
    textureFileName: string
    textureName: string
    textureScale: number
    specificDescription: string
    level: number
    coinPrice: number
    cashPrice: number
    constructionTime: number
    employeeCapacity: number
    patientCapacity: number
    vehicleCapacity: number
    coordinates?: {
        x: number,
        y: number
    }
    

    constructor(building?: any) {
        Object.assign(this, building)
    }
}

export interface BuildingToUser {
    buildingsToUserId: number
    buildingId: number
    userId: number
    createdAt: string
    coordinates: ICoordinates
    address: string,
    building: Building
    vehicles: VehicleToUserBuilding[]
}