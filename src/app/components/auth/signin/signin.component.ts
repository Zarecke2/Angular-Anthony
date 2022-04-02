import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule ,ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'libs/models/users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public errorMessage: string = '';
  public signinForm = new FormGroup({
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",Validators.required)
  });

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    // console.log(this.signinForm.controls['email']?.value)
    this.authService.test({email: this.signinForm.controls['email']?.value, password: this.signinForm.controls['password']?.value }).subscribe((res) => {
      console.log('res', res);
    }, (err) => {
      console.log('err', err);
    });
    const email = this.signinForm.controls['email']?.value;
    const password = this.signinForm.controls['password']?.value;
    // this.auth.signin(email, password).subscribe((res) => {

    // })
    // this.auth.signin(email, password).then(
    //   () => {
    //     this.router.navigate(['/menu']);
    //   }
    // ).catch(
    //   (error) => {
    //     this.errorMessage = error.message;
    //   }
    // );

  }


  jesucequentin() {
    console.log('gloup gloup');
  }

}
