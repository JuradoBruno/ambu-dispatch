import { Building } from '../../models/Building.model';
import { IBuildingToUser } from '../../models/User.model';
import { Mission } from '../../models/Mission.model';

export interface IStoreState {
    accessToken: string
    showSignupComponent: boolean
    showSigninComponent: boolean
    showConstuctionTab: boolean
    user: any
    buildingsToUser: IBuildingToUser[];
    buildings: Building[]
    missions: Mission[]
}