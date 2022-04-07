import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthActions, AccountActions } from '../actions';
import { AuthService } from '../services/auth.service';
import { DataPersistence } from '@nrwl/nx';
import { State } from '../reducers/auth.reducer';
import { map, tap, switchMap } from 'rxjs/operators';
import { extend } from 'underscore';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ofType, createEffect } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';


@UntilDestroy()
@Injectable({ providedIn: 'root' })


export class AuthEffects {
    private return: string = '';
    constructor(
        private router: Router,
        private authService: AuthService,
        private s: DataPersistence<State>,
        private toast: ToastrService
    ) {
        this.router.events.pipe(untilDestroyed(this)).subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.return = evt.url;
            }
        });
    }

    login$ = createEffect(() =>
        this.s.fetch<ReturnType<typeof AuthActions.login>>(AuthActions.login.type, {
            run: (action, state) => {
                return this.authService.logUser(action).pipe(
                    switchMap((credential) => {
                        return [
                            AuthActions.updateCredentials({ profile: credential.user }),
                            AccountActions.updateProfileSuccess({ profile: credential.user }),
                            AuthActions.loginSuccess(extend({}, credential, { return: action?.return }))
                        ]
                    })
                );
            },
            onError: (action, err) => {
                console.log('err', err)
                if (!(err instanceof ProgressEvent) && !err?.includes('401') && !err?.includes('502')
                    && !err?.includes('504') && !err?.includes('Error occured while trying to proxy to')) {
                    if (err === 'accountNotConfirmed') {
                        this.toast.error('Votre compte n\'est pas encore activé !', 'Echec d\'authentification', { timeOut: 80000 });
                        // this.router.navigate(['/auth/reactivate'], { queryParams: { error: 'login' } });
                    } else if (err === 'accountNotAuthorized') {
                        this.toast.error('Vous n\'êtes pas habilité à accéder à cette aplication ! Si besoin, veuillez prendre contact avec l\'un des administrateurs.', 'Echec d\'authentification', { timeOut: 80000 });
                        // this.router.navigate(['/auth/login']);
                    } else if (err === 'accountUnknowed') {
                        this.toast.error('Désolé, le système n\'a pas pu vous identifier. Assurez-vous de disposer d\'un nom d\'utilisateur ou e-mail valide et pré-autorisé.', 'Echec d\'authentification', { timeOut: 80000 });
                        // this.router.navigate(['/auth/login']);
                    } else if (err === 'incorrectPassword') {
                        this.toast.error('Désolé, le système n\'a pas pu vous identifier. Nom d\'utilisateur ou mot de passe incorrects.', 'Echec d\'authentification', { timeOut: 80000 });
                        // this.router.navigate(['/auth/login']);
                    } else if (err === 'incorectSnowCredential') {
                        this.toast.error('Vos identifiants Service Now sont incorrects.', 'Echec d\'authentification', { timeOut: 80000 });
                        // this.router.navigate(['/auth/login']);
                    } else {
                        this.toast.error(err?.error || err?.message || err)
                    }
                }
                return AuthActions.loginFailed();
            }
        })
    );

    loginSucces$ = createEffect(() =>
        this.s.actions.pipe(
            ofType<ReturnType<typeof AuthActions.loginSuccess>>(AuthActions.loginSuccess.type),
            //map((action) => action),
            tap((payload) => {
                if (payload.user.role === 'Admin') {
                    this.toast.clear();
                    if (payload?.return && payload?.return.startsWith('/')) {
                        this.router.navigate([decodeURI(payload.return)]);
                    } else {
                        this.router.navigate(['/menu']);
                    }
                    // }
                } else {
                    this.router.navigate(['/enseignant-menu']);
                }
            })
        ),
        {
            dispatch: false
        }
    );

    logout$ = createEffect(() =>
        this.s.actions.pipe(
            ofType<ReturnType<typeof AuthActions.logout>>(AuthActions.logout.type),
            tap((action) => {
                this.authService.logout();
                this.toast.clear(); // important
                if (!this.return) {
                    this.router.navigate(['/auth/login'], { replaceUrl: true }).then(() => {
                        window.onpopstate = function (e) { window.history.forward(); }
                        location.reload();
                    });
                } else {
                    if (!this.return.startsWith('/auth/login')) {
                        this.router.navigate(['/auth/login'], { queryParams: { return: this.return }, replaceUrl: true }).then(() => {
                            window.onpopstate = function (e) { window.history.forward(); }
                            location.reload();
                        });
                    }
                }
            })
        ),
        { dispatch: false }
    );

}