import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';

@Injectable()
export class BaseHttpService extends ObservableStore<IStoreState> {

    initialState: IBaseHttpStore = {
        accessToken: null,
    }

    constructor() {
        super({
            // stateSliceSelector: state => {
            //     return {
            //         accessToken: state.accessToken
            //     }
            // }
        })
        this.setState(this.initialState, BaseHttpActions.InitState)
    }

    returnRequestOptions() {
        let { accessToken } = this.getState()
        if (!accessToken) accessToken = this.loadToken()

        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    saveToken(accessToken) {
        this.setState({ accessToken }, BaseHttpActions.SaveToken)
        localStorage.setItem('accessToken', accessToken);
    }

    loadToken(): string {
        const accessToken = localStorage.getItem('accessToken');
        this.saveToken(accessToken)
        return accessToken
    }
}

export interface IBaseHttpStore {
    accessToken: string
}

export enum BaseHttpActions {
    InitState = '[BASE-HTTP] INITIALIZE STORE',
    SaveToken = '[AUTH] SAVE NEW JWT TOKEN',
}