import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptor, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { AuthService } from './ngrx/services/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { StoreFacade } from './ngrx/store.facade';
import { timeout, catchError, retry, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { isNull } from 'underscore';
import { EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class BrowserInterceptor implements HttpInterceptor {
    private scope: string = ''
    private newUrl: string = ''

    constructor(
        private _transfertState: TransferState,
        private authService: AuthService,
        private facade: StoreFacade
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = this.authService.getToken();
        if (request.url.startsWith('/api/') || request.url.startsWith('/download/')) {
            if (!isNull(token)) {
                request = request.clone({
                    withCredentials: true,
                    setHeaders: {
                        'Authorization': 'JWT ' + token,
                        'Acces-Control-Allow-Origin': environment.production ? '/' : 'http://localhost:4200/'
                    }
                });
            } else {
                let header: string;
                //if (/\.(?:js)$/.test(request.url)) { header = 'application/javascript'; }
                if (/\.(js)$/.test(request.url)) { header = 'application/javascript'; }
                else if (/\.(css)$/.test(request.url)) { header = 'text/css'; }
                else if (/\.(html)$/.test(request.url)) { header = 'text/html'; }
                else if (/\.(jpe?g)$/.test(request.url)) { header = 'image/jpeg'; }
                else if (/\.(png)$/.test(request.url)) { header = 'image/png'; }
                else if (/\.(gif)$/.test(request.url)) { header = 'image/gif'; }
                else if (/\.(ico)$/.test(request.url)) { header = 'image/x-icon'; }
                else if (/\.(woff)$/.test(request.url)) { header = 'font/woff'; }
                else if (/\.(woff2)$/.test(request.url)) { header = 'font/woff2'; }
                else if (/\.(ttf)$/.test(request.url)) { header = 'font/ttf'; }
                else if (/\.(otf)$/.test(request.url)) { header = 'font/otf'; }
                else { header = 'application/json'; }
                request = request.clone({
                    withCredentials: true,
                    setHeaders: {
                        'Content-Type': header,
                        'Acces-Control-Allow-Origin': environment.production ? '/' : 'http://localhost:4200/'
                    }
                });
            }
        } else {
            request = request.clone({
                withCredentials: true,
                setHeaders: {
                    'Content-Type': 'application/json',
                    'Acces-Control-Allow-Origin': environment.production ? '/' : 'http://localhost:4200/'
                }
            });
        }
        if (request.method !== 'GET') {
            return next.handle(request);
        }
        const storedResponse: String = this._transfertState.get(makeStateKey(request.url), null);
        if (storedResponse) {
            const response = new HttpResponse({ body: storedResponse, status: 200 });
            this._transfertState.remove(makeStateKey(request.url));
            return of(response);
        }
        return next.handle(request);
    }

}

@Injectable({ providedIn: 'root' })

export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private toast: ToastrService,
        private facade: StoreFacade
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            timeout(20000),
            catchError((response, c) => {
                this.toast.clear();
                if (response instanceof HttpErrorResponse) {
                    if (response.status === 401 || response?.message === 'Unauthorized' || response?.error === 'Unauthorized') {
                        const credential = JSON.parse(localStorage.getItem('basso')) || null;
                        this.toast.info(`Ta session a expiré, <strong>${credential?.f}</strong><span>. Merci de te reconnecter stp !`, 'Déconnexion en cours', {
                            timeOut: 18000,
                            progressBar: true,
                            progressAnimation: 'decreasing',
                            closeButton: false,
                            easing: 'ease-out',
                            positionClass: 'toast-bottom-left'
                        });
                        setTimeout(() => {
                            this.facade.logout();
                        }, 18000);
                        return EMPTY;
                    } else if (response.status === 502) {
                        const msg = 'Désolé, l\'application est en cours de maintenance.\nVeuillez vous reconnecter dans quelques instants.';
                        this.toast.error(`<div class="text-center w-100"><i class="fas fa-tools fa-10x"></i></div>\n${msg}`, 'Maintenance en cours', {
                            timeOut: 60000,
                            progressBar: true,
                            progressAnimation: 'decreasing',
                            closeButton: false,
                            easing: 'ease-out'
                        });
                        return EMPTY;
                    } else if (response.status === 504) {
                        this.toast.info('Connexion réseau lente...', '', { timeOut: 1000 });
                        // return EMPTY;
                    } else if (response.status === 0) {
                        this.toast.info('Aucune connexion réseau détectée !', '', { timeOut: 1000 });
                        // return EMPTY;
                    }
                }
                return throwError(response?.error || response?.message || response);
            })
        )

    }
}
