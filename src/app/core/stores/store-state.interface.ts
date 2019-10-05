import { Building } from 'src/app/models/Buildings.model';

export interface IStoreState {
    accessToken: string
    showSignupComponent: boolean
    showSigninComponent: boolean
    showConstuctionTab: boolean
    user: any
    buildings: Building[]
}