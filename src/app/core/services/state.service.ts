import { Injectable } from '@angular/core';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';
import { ObservableStore } from '@codewithdan/observable-store';

@Injectable()
export class StateService extends ObservableStore<IStoreState>  {
    initialState: IStoreState = {
        accessToken: null,
        showSignupComponent: false,
        showSigninComponent: false,
        user: {}
    }

    constructor() {
        super({trackStateHistory: false})
    }
    
    InitializeState() {
        this.setState(this.initialState)
    }
}