import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { Building } from 'src/app/models/Buildings.model';

@Injectable()
export class BuildingsStore extends ObservableStore<IStoreState>{

    mockBuilding: Building = {
        cashPrice: 100,
        coinPrice: 90000,
        constructionTime: 480,
        description: "Mets à disposition des équipes de secouriste et des véhicules",
        employeeCapacity: 4,
        id: 1,
        level: 1,
        patientCapacity: 0,
        title: "Caserne d'ambulance",
        vehicleCapacity: 2
    }

    initialState: IBuildingsStore = {
        buildings: [this.mockBuilding]
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