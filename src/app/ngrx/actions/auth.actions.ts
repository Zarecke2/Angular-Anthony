import { createAction, props } from '@ngrx/store';
import { User } from 'libs/models/users';

export const login = createAction(
    '[Auth] Login',
    props<{ email: string; password: string; rememberme: boolean; return?: string }>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: User, token: string, return?: string }>()
);

export const loginFailed = createAction(
    '[Auth] Login Failed'
);

export const logout = createAction(
    '[Auth] Logout'
);

export const clearToken = createAction(
    '[Auth] Clear Token'
);

export const updateCredentials = createAction(
    '[Auth] Update Credentials',
    props<{ profile: User }>()
);
