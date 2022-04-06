import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'libs/models/users';


@Injectable({
  providedIn: 'root'
})
export class EnseignantService {

  constructor(private http: HttpClient) { }


  getEnseignants() {
    return this.http.get<User[]>('/api/system/backend/enseignants');
  }
}
