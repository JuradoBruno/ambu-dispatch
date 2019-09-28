import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';
import { HttpHeaders } from '@angular/common/http';

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

    saveToken(accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    getTokenFromStorage() {
        return localStorage.getItem('accessToken')
    }

    returnHeaders() {
        let token = this.getTokenFromStorage()
        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
        return headers
    }
}

export interface IBaseHttpStore {
    accessToken: string
}

export enum BaseHttpActions {
    InitState = '[BASE-HTTP] INITIALIZE STORE',
    SaveToken = '[AUTH] SAVE NEW JWT TOKEN',
}