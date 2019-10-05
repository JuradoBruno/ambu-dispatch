import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { User } from 'src/app/models/User.model';

@Injectable()
export class UserStore extends ObservableStore<IStoreState>{
    testUserData: User = {
        id: 49,
        username: 'MockAlmighty',
        password: '$2a$10$7TDmMzY1cxt7en/AZIlNMOiFN.q1S2biP1LjyEZwpU.pBLd5CGHC2',
        email: 'jurado.bruno@gmail.com',
        salt: '$2a$10$7TDmMzY1cxt7en/AZIlNMO',
        coinMoney: 159999,
        cashMoney: 150,
        buildingsToUser: []
    }

    testUser = new User(this.testUserData)

    initialState: IAuthStore = {
        user: this.testUser
    }

    constructor() {
        super({
            trackStateHistory: false
        })
        this.setState(this.initialState, UserActions.InitState)
    }

    storeCurrentUser(user: User) {
        this.setState({ user }, UserActions.StoreCurrentUser)
    }
}

export enum UserActions {
    InitState = '[USER] Initialize User state',
    StoreCurrentUser = '[USER] Store current USER'
}

export interface IAuthStore {
    user: User,
}