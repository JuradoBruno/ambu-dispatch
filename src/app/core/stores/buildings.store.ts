import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { Building } from 'src/app/models/Buildings.model';
import { IBuildingToUser } from '../../models/User.model';

@Injectable()
export class BuildingsStore extends ObservableStore<IStoreState>{

    mockBuilding: Building = {
        buildingCore: {
            title: "Caserne d'ambulance",
            description: "Mets à disposition des équipes de secouriste et des véhicules",
        },
        specificDescription: '',
        cashPrice: 100,
        coinPrice: 90000,
        constructionTime: 480,
        employeeCapacity: 4,
        id: 1,
        level: 1,
        patientCapacity: 0,
        vehicleCapacity: 2
    }

    initialState: IBuildingsStore = {
        buildings: [],
        buildingsToUser: []
    }

    constructor() {
        super({
            trackStateHistory: false
        })
        this.setState(this.initialState, BuildingsActions.InitState)
    }

    storeBuildingsToUser(buildingsToUser: IBuildingToUser[]) {
        this.setState({ buildingsToUser }, BuildingsActions.StoreBuildingsToUser)
    }

    storeBuildings(buildings: Building[]) {
        this.setState({ buildings }, BuildingsActions.StoreBuildings)
    }
}

export enum BuildingsActions {
    InitState = '[Buildings] Initialize Buildings state',
    StoreBuildings = '[Buildings] Store Buildings',
    StoreBuildingsToUser = "[Buildings] Store Users Buildings"
}

export interface IBuildingsStore {
    buildings: Building[],
    buildingsToUser: IBuildingToUser[]
}