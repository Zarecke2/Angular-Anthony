import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/nx';
import { AuthActions, AccountActions } from '../actions';
import { State } from '../reducers/account.reducer';
import { ofType, createEffect } from '@ngrx/effects';
import { map, tap, switchMap } from 'rxjs/operators';
import { omit } from 'underscore';
import { AuthService } from '../services/auth.service';



@Injectable({ providedIn: 'root' })

export class AccountEffects {
  constructor(
    private AuthService: AuthService,
    private s: DataPersistence<State>,
    // private toast: ToastrService,
  ) { }

  loadProfile$ = createEffect(() =>
  this.s.fetch<ReturnType<typeof AccountActions.loadProfile>>(AccountActions.loadProfile.type, {
    run: (action, state) => {
      return this.AuthService.getProfile().pipe(
        switchMap((user) => {
          return [
            AuthActions.updateCredentials({ profile: user }),
            AccountActions.updateProfileSuccess({ profile: user })
          ];
        })
      );
    },
    onError: (action, err) => {
      return AccountActions.authorizeFailed(err);
    }
  })
);


}