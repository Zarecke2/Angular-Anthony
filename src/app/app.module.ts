import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/auth/signin/signin.component';


import { AddEnseignantComponent } from './components/menu/add-enseignant/add-enseignant.component';
import { EditEnseignantComponent } from './components/menu/edit-enseignant/edit-enseignant.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { HeaderPageComponent } from './components/partials/header-page/header-page.component';
import { QuickViewModalComponent } from './components/partials/modal/quick-view-modal/quick-view-modal.component';
import { DeleteEnseignantModalComponent } from './components/partials/modal/delete-enseignant-modal/delete-enseignant-modal.component';
import { FormBuilder, FormGroup, Validators, FormsModule ,ReactiveFormsModule, FormControl } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { MatTableModule } from '@angular/material/table'


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    MenuComponent,
    AddEnseignantComponent,
    EditEnseignantComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    HeaderPageComponent,
    QuickViewModalComponent,
    DeleteEnseignantModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
