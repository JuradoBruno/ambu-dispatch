import { Building } from '../../models/Buildings.model';
import { IBuildingToUser } from '../../models/User.model';

export interface IStoreState {
    accessToken: string
    showSignupComponent: boolean
    showSigninComponent: boolean
    showConstuctionTab: boolean
    user: any
    buildingsToUser: IBuildingToUser[];
    buildings: Building[]
}