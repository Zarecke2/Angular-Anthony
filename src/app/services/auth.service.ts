import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ue } from 'libs/models/ue';
import { User } from 'libs/models/users';
// import { rejects } from 'assert';
// import { resolve } from 'dns';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private api = environment.api;
  private token: any = '';
  private userId: any = '';
  isAuth$ = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) { }

  test(query?: {email: string, password: string}) {
    return this.http.post<{user: User, ue: Ue}>('/api/system/backend/test', query)
  }

  adminConnexion() {
    
  }

  signin(query: {email: string, password: string}) {
    return this.http.post<{user: User, ue: Ue}>('/api/system/backend/signin', query)
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

  logout() {
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;

  }
}
