import * as fromRouter from '@ngrx/router-store';
import * as fromAuth from './auth.reducer';
import * as fromAccount from './account.reducer';
import { ActionReducer, ActionReducerMap, createSelector, Action, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';


export interface State {
    [fromAuth.authFeatureKey]: fromAuth.State;
    [fromAccount.accountFeatureKey]: fromAccount.State;
    router: fromRouter.RouterReducerState<any>;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('Root reducers token', {
    factory: () => ({
        [fromAuth.authFeatureKey]: fromAuth.reducer,
        [fromAccount.accountFeatureKey]: fromAccount.reducer,
        router: fromRouter.routerReducer
    })
});

export const getAuthState = createFeatureSelector<State, fromAuth.State>(fromAuth.authFeatureKey);
export const getAuthStore = createSelector(getAuthState, fromAuth.getAuthState);
export const getAccountState = createFeatureSelector<State, fromAccount.State>(fromAccount.accountFeatureKey);
export const getAccountStore = createSelector(getAccountState, fromAccount.getAccountState);
export const getProfile = createSelector(getAccountState, fromAccount.getProfile);



export function localStorageSyncReducer(reducer: ActionReducer<State>): ActionReducer<State> {
    return localStorageSync({
        keys: [
            { 'basso': ['f', 'l', 't', 'r', 'e', 'at'] },
            { 'account': ['profile'] }
        ],
        rehydrate: true,
        storage: localStorage,
        removeOnUndefined: true
    })(reducer);
}

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state, action) => {
        const result = reducer(state, action);
        console.groupCollapsed(action.type);
        console.log('prev state', state);
        console.log('action', action);
        console.log('next state', result);
        console.groupEnd();
        return result;
    };
}

export function clearState(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state: State, action: Action) => {
        if (action.type === '[Auth] Logout') {
            state = Object.assign({}, state, { account: undefined, snow: undefined }) as State;
        }
       return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[] = environment.production
    ? [localStorageSyncReducer, clearState]
    : [logger, localStorageSyncReducer, clearState];