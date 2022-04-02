import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  test() {
    return this.http.get<{message: string}>('/api/system/backend/test')
  }



  signin(email: string, password: string) {
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
