import { Building } from './Building.model'
import { Mission } from './Mission.model'

export class User {
    id: number
    username: string
    password: string
    email: string
    salt: string
    coinMoney: number
    cashMoney: number
    buildingsToUser: IBuildingToUser[]
    missionsToUser: IMissionToUser[]
    
    constructor(user?: any) {
        Object.assign(this, user)
    }
}

export interface IBuildingToUser {
    buildingsToUserId: number,
    buildingId: number,
    userId: number,
    createdAt: string,
    coordinates: {
        x: number,
        y: number
    },
    address: string,
    building: Building
}

export interface IMissionToUser {
    id: number,
    missionId: number,
    userId: number,
    state: any,
    createdAt: string,
    coordinates: {
        x: number,
        y: number
    },
    address: string,
    mission: Mission
}