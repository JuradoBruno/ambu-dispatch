import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ModalService } from '../modal/modal.service';

@Injectable()
export class BaseHttpService extends ObservableStore<IStoreState> {
    baseUrl = environment.baseUrl

    initialState: IBaseHttpStore = {
        accessToken: null,
    }

    constructor(
        private http: HttpClient,
        private modal: ModalService
    ) {
        super({})
        this.setState(this.initialState, BaseHttpActions.InitState)
    }

    get<T>(url, options = {}, handleError = true): Promise<T | any> {
        return this.http.get<T>(this.baseUrl + url, options).toPromise()
        .catch(error => {
            if (!handleError) throw error
            this.handleError(error)
        })
    }

    post<T>(url, body, options = {}, handleError = true): Promise<T | any> {
        let headers = this.returnHeaders()
        return this.http.post<T>(this.baseUrl + url, body, {...options, headers}).toPromise()
        .catch(error => {
            if (!handleError) throw error
            this.handleError(error)
        })
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

    handleError(error) {
        let header = "Erreur" + error.error.statusCode
            this.modal.show({
                header,
                body: error.error.message,
                cancelButtonVisible: false
            })
    }
}

export interface IBaseHttpStore {
    accessToken: string
}

export enum BaseHttpActions {
    InitState = '[BASE-HTTP] INITIALIZE STORE',
    SaveToken = '[AUTH] SAVE NEW JWT TOKEN',
}