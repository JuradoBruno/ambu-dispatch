import { BuildingToUser } from './Building.model'
export interface Vehicle {
    id: number
    title: string
    description: string
    code: string
    minimumPlayerLvl: number
    minimumDirectionLvl: number
    price: number
    constructionTimeMinutes: number //minutes
    capacity: number
}

export class VehicleToUserBuilding {
    id: number
    createdAt: Date
    coordinates: any
    address: string
    vehicle: Vehicle
    vehicleId: number    
    buildingToUser?: BuildingToUser 
    buildingToUserId: number
    state: VehicleState
    stateId: number
    isSelected?: boolean
}

export interface VehicleState {
    id: number
    code: string
    title: string
    description: string
}

export enum VehicleStateCodes {
    Disponible = "1",
    EnDirectionDeLaMission = '2'
}