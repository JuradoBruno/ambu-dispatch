import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';
import { of, Observable } from 'rxjs';

@Injectable()
export class ComponentsStateService extends ObservableStore<IStoreState> {

    initialState: IComponentStateStore = {
        showSigninComponent: false,
        showSignupComponent: false
    }

    constructor() {
        super({
            trackStateHistory: true,
            stateSliceSelector: state => { // This is the properties that will be used as "state" here.
                return {
                    showSigninComponent: state.showSigninComponent,
                    showSignupComponent: state.showSignupComponent,
                }
            }
        })
        this.setState(this.initialState, ComponentStateActions.InitState) // CRUCIAL to be able to use "stateChanged" instead of "globalStateChanged"
    }

    changeComponentState(action, value?) {
        switch (action) {
            case ComponentStateActions.OpenSigninComponent:
                this.setState({ showSigninComponent: true }, ComponentStateActions.OpenSigninComponent)
                break;

            case ComponentStateActions.OpenSignupComponent:
                this.setState({ showSignupComponent: true }, ComponentStateActions.OpenSignupComponent)
                break;

            case ComponentStateActions.CloseSigninComponent:
                this.setState({ showSigninComponent: false }, ComponentStateActions.CloseSigninComponent)
                break;

            case ComponentStateActions.CloseSignupComponent:
                this.setState({ showSignupComponent: false }, ComponentStateActions.CloseSignupComponent)
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
    InitState = '[COMPO STATE] INITIALIZE COMPONENT STATE',

    OpenSigninComponent = '[COMPO STATE] OPEN SIGNIN COMPONENT',
    CloseSigninComponent = '[COMPO STATE] CLOSE SIGNIN COMPONENT',
    
    OpenSignupComponent = '[COMPO STATE] OPEN SIGNUP COMPONENT',
    CloseSignupComponent = '[COMPO STATE] CLOSE SIGNUP COMPONENT'    
}

export interface IComponentStateStore {
    showSigninComponent: boolean,
    showSignupComponent: boolean
}