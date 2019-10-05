import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/core/stores/store-state.interface';
import { of, Observable } from 'rxjs';

@Injectable()
export class ComponentsStateStore extends ObservableStore<IStoreState> {

    initialState: IComponentStateStore = {
        showSigninComponent: false,
        showSignupComponent: false,
        showConstuctionTab: false
    }

    constructor() {
        super({trackStateHistory: true})
        this.setState(this.initialState, ComponentStateActions.InitState) // CRUCIAL to be able to use "stateChanged" instead of "globalStateChanged"
    }

    changeComponentState(action, value?) {
        switch (action) {
            case ComponentStateActions.OpenSigninComponent:
                this.setState({ showSigninComponent: true }, ComponentStateActions.OpenSigninComponent)
                break;
                
            case ComponentStateActions.CloseSigninComponent:
                this.setState({ showSigninComponent: false }, ComponentStateActions.CloseSigninComponent)
                break;

            case ComponentStateActions.OpenSignupComponent:
                this.setState({ showSignupComponent: true }, ComponentStateActions.OpenSignupComponent)
                break;

            case ComponentStateActions.CloseSignupComponent:
                this.setState({ showSignupComponent: false }, ComponentStateActions.CloseSignupComponent)
                break;

            case ComponentStateActions.OpenConstructionTab:
                this.setState({ showConstuctionTab: true }, ComponentStateActions.OpenConstructionTab)
                break;

            case ComponentStateActions.CloseConstructionTab:
                this.setState({ showConstuctionTab: false }, ComponentStateActions.CloseConstructionTab)
                break;

            default:
                break;
        }
    }

    getComponentState(componentName): Observable<any> {
        let state = this.getState()
        if (!state) throw "You must initialize the State before using it!";
        switch (componentName) {
            case 'signin':
                return of(state.showSigninComponent)

            case 'signup':
                return of(state.showSignupComponent)

            default:
                break;
        }
    }

}


export enum ComponentStateActions {
  InitState = '[COMPO STATE] Initialize Components State',

  OpenSigninComponent = '[COMPO STATE] Open signin component',
  CloseSigninComponent = '[COMPO STATE] Close signin component',

  OpenSignupComponent = '[COMPO STATE] Open signup component',
  CloseSignupComponent = '[COMPO STATE] Close signup component',

  OpenConstructionTab = "[COMPO STATE] Open Construction Tab",
  CloseConstructionTab = "[COMPO STATE] Close Construction Tab",
}

export interface IComponentStateStore {
    showSigninComponent: boolean,
    showSignupComponent: boolean,
    showConstuctionTab: boolean
}