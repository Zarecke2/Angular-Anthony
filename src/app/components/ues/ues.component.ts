import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Ue } from 'libs/models/ue';
import { User } from 'libs/models/users';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Enseignant } from 'src/app/models/enseignant';
import { EnseignantService } from 'src/app/ngrx/services/enseignant.service';
import { StoreFacade } from 'src/app/ngrx/store.facade';



@Component({
    selector: 'app-menu',
    templateUrl: 'ue.component.html',
})

export class UeComponent implements OnInit {
    constructor(private enseignantService: EnseignantService, private facade: StoreFacade, private modalService: BsModalService,
        private toast: ToastrService) { }

    public profile: User;
    public ues: Ue[];

    /*
    "Formation"?: string;
        "Semestre"?: string;
        "Ref"?: string;
        "Intitule"?: string;
        "Statut"?: string;
        "h_CM"?: number;
        "h_TD"?: number;
        "h_TP"?: number;
        "Effectif"?: number;
        "grCM"?: number;
        "grTD"?: number;
        "grTP"?: number;
    */

    public ueForm = new FormGroup({
        _id: new FormControl(''),
        Formation: new FormControl('', Validators.required),
        Semestre: new FormControl('', Validators.required),
        Intitule: new FormControl('', Validators.required),
        Statut: new FormControl('', Validators.required),
        h_CM: new FormControl(0),
        h_TD: new FormControl(0),
        h_TP: new FormControl(0),
        Effectif: new FormControl(0),
        grCM: new FormControl(0),
        grTD: new FormControl(0),
        grTP: new FormControl(0),
    })

    ngOnInit(): void {
        // this.facade.account$.pipe(take(1)).subscribe((account) => {
        //   this.profile = account.profile;
        //   this.ueForm.patchValue(this.profile);
        // })
    }

    addUe() {
        this.enseignantService.addUE(this.ueForm.value).pipe(take(1)).subscribe((res) => {
            //   this.facade.updateProfileSuccess(res.enseignant);
            this.toast.success('Votre profil à bien été modifié !')
        }, (err) => {
            this.toast.error(err)
        });
    }

    confirmEditEnseignant() {
        this.enseignantService.editUE(this.ueForm.value).pipe(take(1)).subscribe((res) => {
            this.ues.filter(ue => ue._id !== res.ue?._id ).concat(res.ue);
            this.toast.success('Votre profil à bien été modifié !')
        }, (err) => {
            this.toast.error(err)
        });

        // console.log(this.enseignantForm.value);
    }
}





