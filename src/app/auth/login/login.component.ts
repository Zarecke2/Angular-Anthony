import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'libs/models/users';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/ngrx/services/auth.service';
import { StoreFacade } from 'src/app/ngrx/store.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  public errorMessage: string = '';
  public signinForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
    rememberme: new FormControl(false)
  });
  public user: any = null
  return = '';

  constructor(private authService: AuthService, private facade: StoreFacade, private toast: ToastrService) { }

  ngOnInit(): void {
    const credential = JSON.parse(localStorage.getItem('basso')) || null;
    this.signinForm.controls['password'].reset();
    if (credential) {
      if (credential.r) {
        if (credential.e) {
          this.signinForm.patchValue({
            email: credential.e,
            rememberme: credential.r ? true : false
          });
        }
      }
    }
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.user = {
        email: this.signinForm.controls['email']?.value,
        password: this.signinForm.controls['password']?.value,
        // rememberme: this.signinForm.controls['rememberme']?.value,
        return: this.return
      };
      this.authService.logUser({
        email: this.signinForm.controls['email']?.value,
        password: this.signinForm.controls['password']?.value
      }).pipe(take(1)).subscribe((res) => {
        console.log('res', res);
      }, (err) => {
        console.log('error occured', err)
        this.toast.warning(err);
      })
      console.log(this.user);
      this.facade.login(this.user);
      this.signinForm.controls['password'].reset();
    } else {
      this.signinForm.controls['password'].reset();
      this.toast.info('Vous devez rentrez votre nom d\'utilisateur et le mot de passe', 'Demande invalide!');
    }
    console.log(this.user)
  }

  registerFirstAdmin() {
    // this.authService.createAdmin().pipe(take(1)).subscribe((res) => {

    // });
  }
}
