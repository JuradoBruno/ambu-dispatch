import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { Building } from 'src/app/models/Buildings.model';

@Injectable()
export class BuildingsStore extends ObservableStore<IStoreState>{

    initialState: IBuildingsStore = {
        buildings: []
    }

    constructor() {
        super({
            trackStateHistory: false
        })
        this.setState(this.initialState, BuildingsActions.InitState)
    }

    storeBuildings(buildings: Building[]) {
        this.setState({ buildings }, BuildingsActions.StoreBuildings)
    }
}

export enum BuildingsActions {
    InitState = '[Buildings] Initialize Buildings state',
    StoreBuildings = '[Buildings] Store Buildings'
}

export interface IBuildingsStore {
    buildings: Building[],
}