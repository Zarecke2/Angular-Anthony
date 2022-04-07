import { Component, OnInit, } from '@angular/core';
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
  templateUrl: 'profile.component.html',
})

export class ProfileComponent implements OnInit {
  public possible_status = ['EC', 'PRAG', 'PAST', 'VACATAIRE', 'CDE', 'ATER'];
  constructor(private enseignantService: EnseignantService, private facade: StoreFacade, private modalService: BsModalService,
    private toast: ToastrService) { }
  
  public profile: User;

  public enseignantForm = new FormGroup({
    _id: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    status: new FormControl('', Validators.required),
    uc: new FormControl(0),
    password: new FormControl(''),
  })

  ngOnInit(): void {
    this.facade.account$.pipe(take(1)).subscribe((account) => {
      this.profile = account.profile;
      this.enseignantForm.patchValue(this.profile);
    })
  }

  confirmEditEnseignant() {
    this.enseignantService.editEnseignant(this.enseignantForm.value).pipe(take(1)).subscribe((res) => {
      this.facade.updateProfileSuccess(res.enseignant);
      this.toast.success('Votre profil à bien été modifié !')
    }, (err) => {
      this.toast.error(err)
    });

    // console.log(this.enseignantForm.value);
  }
}





