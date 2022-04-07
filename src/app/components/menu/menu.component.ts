import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'libs/models/users';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Enseignant } from 'src/app/models/enseignant';
import { EnseignantService } from 'src/app/ngrx/services/enseignant.service';
import { StoreFacade } from 'src/app/ngrx/store.facade';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],

})


export class MenuComponent implements OnInit {
  @ViewChild('editEnseignantModal') editEnseignantModal: BsModalRef
  event: string;
  constructor(private enseignantService: EnseignantService, private facade: StoreFacade, private modalService: BsModalService,
    private toast: ToastrService) { }

  public profile: User;
  selected_user: User;
  public enseignants: User[] = [];

  public enseignantForm = new FormGroup({
    _id: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    status: new FormControl(''),
    password: new FormControl(''),
    uc: new FormControl(0)
  });
  public possible_status = ['EC', 'PRAG', 'PAST', 'VACATAIRE', 'CDE', 'ATER'];


  ngOnInit(): void {
    this.facade.profile$.pipe(take(1)).subscribe((account) => {
      this.profile = account;
    })


    this.enseignantService.getEnseignants().subscribe(
      (enseignants: User[]) => {
        this.enseignants = enseignants;
      },
      (error) => {
        console.log('error', error);
      }
    );

  }

  addEnseignant() {
    console.log(this.enseignantForm.value)
    this.enseignantService.addEnseignant(this.enseignantForm.value).pipe(take(1)).subscribe((res) => {
      if (res?.enseignant) {
        this.enseignants.push(res.enseignant)
      }
    }, (err) => {
      this.toast.error(err)
    });
  }


  editEnseignant(id: string, event: string) {
    this.enseignantForm.reset();
    this.selected_user = this.enseignants.find(enseignant => enseignant._id === id)
    this.enseignantForm.patchValue(this.selected_user);
    this.event = event;
  }


  confirmEditEnseignant() {
    this.enseignantService.editEnseignant(this.enseignantForm.value).pipe(take(1)).subscribe((res) => {
      this.enseignants.filter(en => en._id !== res.enseignant?._id)
      this.enseignants.push(res.enseignant);
      this.toast.success('L\'enseignant à été ajouté avec succès !')
    }, (err) => {
      this.toast.error(err)
    });

    // console.log(this.enseignantForm.value);
  }

  deleteEnseignant(id: string) {
    if (confirm('Voulez-vous vraiment supprimer l\'enseignant ?')) {
      this.enseignantService.deleteEnseignant({ _id: id }).pipe(take(1)).subscribe((res) => {
        this.enseignants.filter(en => en?._id !== id);
        this.toast.success('L\'enseignant à bien été supprimé !')
      }, (err) => {
        this.toast.error(err)
      });
    } else {
      return;
    }

  }

}





