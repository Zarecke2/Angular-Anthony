import { User } from "libs/models/users";
import { createReducer, on } from '@ngrx/store';
import { AccountActions } from '../actions';
import { extend, omit, pluck, union } from 'underscore';


export const accountFeatureKey = 'account';

export interface State {
    isLoading: boolean;
    profile: User;
    enseignants: User[];
}

const initialState: State = {
    isLoading: false,
    profile: null,
    enseignants: []
}


export const reducer = createReducer(
    initialState,
    on(AccountActions.clearState, (state) => ({ ...initialState })),
    on(AccountActions.authorize || AccountActions.loadProfile,
        (state) => ({ ...state, isLoading: true })),
    on(AccountActions.authorizeSuccess, (state, action) => ({ ...state, isLoading: false })),
    // on(AccountActions.authorizeFailed || AccountActions.authorize, (state) => ({ ...initialState }))
    on(AccountActions.updateProfileSuccess, (state, action) => ({ ...state, isLoading: false, profile: action.profile }))
);

export const getAccountState = (state: State) => state;
export const getProfile = (state: State) => state.profile;