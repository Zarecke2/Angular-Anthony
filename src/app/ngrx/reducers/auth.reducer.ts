import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';

export const authFeatureKey = 'basso';

export interface State {
    isLoading: boolean;
    t: string; // token
    r: boolean; //rememberme
    f: string; // first_name
    l: string; // last_name
    e: string;
    at: string;
}

const initialState: State = {
    isLoading: false,
    t: null,
    r: true,
    f: null,
    l: null,
    e: null,
    at: null,
}

export const reducer = createReducer(
    initialState,
    // Even thought the `state` is unused, it helps infer the return type
    on(AuthActions.login, (state, action) => ({ ...state, isLoading: true, r: action.rememberme })),
    on(AuthActions.loginSuccess, (state, action) => ({ ...state, isLoading: false, t: action.token })),
    on(AuthActions.updateCredentials, (state, action) => ({
      ...state, f: action.profile?.first_name, l: action.profile?.last_name, e: action.profile.email
    })),

    on(AuthActions.loginFailed, (state) => ({ ...initialState })),
    on(AuthActions.logout, (state) => ({
      ...state, isLoading: false,
      at: undefined, t: undefined, f: state.r? state.f: undefined, l: state.r? state.l: undefined, e: state.e ?? undefined
    })),
    on(AuthActions.clearToken, (state) => ({
      ...state, isLoading: false,
      at: undefined, t: undefined, f: state.r? state.f: undefined, l: state.r? state.l: undefined, e: state.e ?? undefined
    }))
  );
  
  export const getAuthState = (state: State) => state;