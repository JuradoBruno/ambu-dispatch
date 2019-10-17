import { Building } from '../../models/Building.model';
import { BuildingToUser } from '../../models/User.model';
import { Mission } from '../../models/Mission.model';

export interface IStoreState {
    accessToken: string
    showSignupComponent: boolean
    showSigninComponent: boolean
    showConstuctionTab: boolean
    user: any
    buildingsToUser: BuildingToUser[];
    buildings: Building[]
    missions: Mission[]
}