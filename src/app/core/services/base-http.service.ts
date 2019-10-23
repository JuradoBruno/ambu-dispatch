import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class BaseHttpService extends ObservableStore<IStoreState> {
    baseUrl = environment.baseUrl

    initialState: IBaseHttpStore = {
        accessToken: null,
    }

    constructor(
        private http: HttpClient
    ) {
        super({})
        this.setState(this.initialState, BaseHttpActions.InitState)
    }

    get<T>(url, options = {}): Promise<T> {
        return this.http.get<T>(this.baseUrl + url, options).toPromise()
    }

    post<T>(url, body, options = {}): Promise<T | any> {
        let headers = this.returnHeaders()
        return this.http.post<T>(this.baseUrl + url, body, {...options, headers}).toPromise()
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