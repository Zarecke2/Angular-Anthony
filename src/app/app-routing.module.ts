import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/auth/signin/signin.component';
import { AddEnseignantComponent } from './components/menu/add-enseignant/add-enseignant.component';
import { EditEnseignantComponent } from './components/menu/edit-enseignant/edit-enseignant.component';
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';

const routes: Routes = [
  { path :'menu', component: MenuComponent},
  { path :'add-enseignant', component: AddEnseignantComponent},
  { path :'edit-enseignant/:id', component: EditEnseignantComponent},
  //{ path :'notfound', component: NotFoundComponent},
  { path :'**', component: SigninComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
