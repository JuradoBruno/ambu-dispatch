import { Building } from './Building.model'

export class User {
    id: number
    username: string
    password: string
    email: string
    salt: string
    coinMoney: number
    cashMoney: number
    buildingsToUser: IBuildingToUser[]
    
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