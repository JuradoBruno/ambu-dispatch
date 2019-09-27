import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from 'src/app/shared/interfaces/store-state.interface';
import { of, Observable } from 'rxjs';

@Injectable()
export class ComponentsStateService extends ObservableStore<IStoreState> {

    constructor() {
        super({ trackStateHistory: true})
    }

    changeComponentState(action, value?) {
        switch (action) {
            case ComponentStateActions.OpenSigninComponent:
                this.setState({showSigninComponent: true}, ComponentStateActions.OpenSigninComponent)     
                let state = this.getState()
                break;
            
            case ComponentStateActions.OpenSignupComponent:
                this.setState({showSignupComponent: true }, ComponentStateActions.OpenSignupComponent)                
                break;

            case ComponentStateActions.CloseSigninComponent:
                this.setState({showSigninComponent: false }, ComponentStateActions.CloseSigninComponent)                
                break;
            
            case ComponentStateActions.CloseSignupComponent:
                this.setState({showSignupComponent: false }, ComponentStateActions.CloseSignupComponent)                
                break;
        
            default:
                break;
        }
    }

    getComponentState(componentName): Observable<any> {
        let state = this.getState()
        console.log("TCL: ComponentsStateService -> state", state)
        if (!state) return
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
    OpenSigninComponent = 'open_signin_component',
    CloseSigninComponent = 'close_signin_component',

    OpenSignupComponent = 'open_signup_component',
    CloseSignupComponent = 'close_signup_component'
}