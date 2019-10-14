import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { Mission } from '../../models/Mission.model';

@Injectable()
export class MissionsStore extends ObservableStore<IStoreState>{

    initialState: IMissionsStore = {
        missions: [],
    }

    constructor() {
        super({
            trackStateHistory: false
        })
        this.setState(this.initialState, MissionsActions.InitState)
    }

    storeMissions(missions: Mission[]) {
        this.setState({ missions }, MissionsActions.StoreMissions)
    }
}

export enum MissionsActions {
    InitState = '[Missions] Initialize Missions state',
    StoreMissions = '[Missions] Store Missions',
}

export interface IMissionsStore {
    missions: Mission[],
}