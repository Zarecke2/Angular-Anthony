import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import {
  AuthComponent, AuthLoginComponent,
} from './auth';
import { MenuComponent } from './components/menu/menu.component';
import { ProfileComponent } from './components/profile/profile.component';
;

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth', component: AuthComponent,
    data: { title: 'Authentification' },
    children: [
      { path: 'login', component: AuthLoginComponent, data: { title: 'Connect' } },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: '', component: DefaultLayoutComponent,
    data: { title: 'Accueil' },
    children: [
     {
       path: 'menu',
       component: MenuComponent
     },
     {
      path: 'account/profile',
      component: ProfileComponent
    },
    ]
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
    // preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
