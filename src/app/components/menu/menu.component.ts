import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule ,ReactiveFormsModule, FormControl } from '@angular/forms';
import { User } from 'libs/models/users';
import { Enseignant } from 'src/app/models/enseignant';
import { EnseignantService } from 'src/app/services/enseignant.service';




  @Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css'],

  })


export class MenuComponent implements OnInit {
  constructor(private backendService: EnseignantService) {}

  displayedColumns: string[] = ['nom', 'prenom', 'mail', 'password', 'status', 'uc'];


  public dataSource: User[] = [];

  ngOnInit(): void {
    this.backendService.getEnseignants().subscribe(
      (data: User[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.log('error', error);
      }
    );

  }


}





