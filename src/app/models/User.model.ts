import { BuildingToUser } from './Building.model'
import { MissionToUser } from './Mission.model'

export class User {
    id: number
    username: string
    password: string
    email: string
    salt: string
    coinMoney: number
    cashMoney: number
    buildingsToUser: BuildingToUser[]
    missionsToUser: MissionToUser[]
    
    constructor(user?: any) {
        Object.assign(this, user)
    }
}