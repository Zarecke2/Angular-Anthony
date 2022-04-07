import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { User } from 'libs/models/users';

import * as fromReducers from './reducers';
import { AuthActions, AccountActions } from './actions';


@Injectable({ providedIn: 'root' })


export class StoreFacade {
    constructor(
        private store: Store<fromReducers.State>
    ) { }

    profile$ = this.store.pipe(select(fromReducers.getProfile));
    account$ = this.store.pipe(select(fromReducers.getAccountState));    
    auth$ = this.store.pipe(select(fromReducers.getAuthState));


    login(payload: any) { this.store.dispatch(AuthActions.login(payload)); }
    logout() { this.store.dispatch(AuthActions.logout()); }
    clearToken() { this.store.dispatch(AuthActions.clearToken()); }
    loadProfile() { this.store.dispatch(AccountActions.loadProfile()); }
    updateProfileSuccess(payload?: User) { this.store.dispatch(AccountActions.updateProfileSuccess({ profile: payload })); }
    updateProfileConnectionSuccess(payload?: Date) { this.store.dispatch(AccountActions.updateProfileConnectionSuccess({ date: payload })); }
    
}