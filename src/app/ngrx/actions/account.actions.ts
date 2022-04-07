import { createAction, props } from "@ngrx/store";
import { User } from "libs/models/users";

export const clearState = createAction(
    '[Account] Clear State'
);

export const authorize = createAction(
    '[Account] Authorize',
    props<{ user: User }>()
);

export const authorizeSuccess = createAction(
    '[Account] Authorize Success',
    props<{ user: User }>()
);

export const authorizeFailed = createAction(
    '[Account] Authorize Failed',
    props<any>()
);

export const loadProfile = createAction(
    '[Account] Load Profile'
);

export const updateProfileSuccess = createAction(
    '[Account] Update Profile Success',
    props<{ profile: User }>()
);

export const updateProfileConnectionSuccess = createAction(
    '[Account] Update Profile Connection Success',
    props<{ date: Date }>()
);