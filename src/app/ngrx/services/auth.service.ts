import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ue } from 'libs/models/ue';
import { User } from 'libs/models/users';
// import { rejects } from 'assert';
// import { resolve } from 'dns';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isNull, isUndefined } from 'underscore';

const jwthelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private api = environment.api;
  isConnected: Boolean = true;


  constructor(private http: HttpClient) { }

  test(query?: { email: string, password: string }) {
    return this.http.post<{ user: User, ue: Ue }>('/api/system/backend/test', query)
  }

  adminConnexion() {

  }

  createAdmin() {
    return this.http.get<User>('/api/system/auth/firstAdmin');
  }

  logUser(credential) {
    return this.http.post<{ user: User, token: string }>('/api/system/auth/login', credential);
  }


  signin(query: { email: string, password: string }) {
    return this.http.post<string>('/api/system/auth/signin', query)
    // return this.http.post<>(this.api + '/login', { email: email, password: password });
    // return new Promise((resolve, reject) => {
    //   this.http.post(this.api + '/login', { email: email, password: password }).subscribe(
    //     (authData: { token: string, userId: string }) => {
    //       this.token = authData.token;
    //       this.userId = authData.userId;
    //       this.isAuth$.next(true);
    //       resolve(true);
    //     },
    //     (error) => {
    //       reject(error)
    //     }
    //   )
    // })
  }

  loggedIn(): boolean {
    return !jwthelper.isTokenExpired(this.getToken());
  }

  getToken(): string {
    const credential = JSON.parse(localStorage.getItem('basso'));
    if (!isNull(credential) && !isUndefined(credential) && !isNull(credential.t) && !isUndefined(credential.t)) {
      return credential.t;
    } else {
      return null;
    }
  }

  getProfile() {
    return this.http.get<User>('/api/system/auth/profile');
  }

  logout() {
    if (this.isConnected) {
      this.http.post('/api/system/auth/logout', {});
    }
  }


}
