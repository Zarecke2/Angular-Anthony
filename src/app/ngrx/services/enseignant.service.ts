import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'libs/models/users';
import { Ue } from 'libs/models/ue';


@Injectable({
  providedIn: 'root'
})
export class EnseignantService {

  constructor(private http: HttpClient) { }


  getEnseignants() {
    return this.http.get<User[]>('/api/system/backend/get-enseignants');
  }

  deleteEnseignant(query: { _id: string }) {
    return this.http.post<{ success: boolean }>('/api/system/backend/delete-enseignants', query)
  }

  addEnseignant(query: { enseignant: User }) {
    return this.http.post<{ enseignant: User }>('/api/system/backend/add-enseignant', query)
  }


  editEnseignant(query: { enseignant: User }) {
    return this.http.post<{ enseignant: User }>('/api/system/backend/edit-enseignant', query)
  }

  getUe() {
    return this.http.get<Ue[]>('/api/system/backend/get-ues');

  }

  deleteUe(query: { _id: string }) {
    return this.http.post<{ success: boolean }>('/api/system/backend/delete-ue', query)
  }

  addUe(query: { ue: Ue }) {
    return this.http.post<{ ue: Ue }>('/api/system/backend/add-ue', query)
  }


  editUe(query: { ue: Ue }) {
    return this.http.post<{ ue: Ue }>('/api/system/backend/edit-ue', query)
  }

}
