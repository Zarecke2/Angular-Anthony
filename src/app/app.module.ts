import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { NxModule } from '@nrwl/nx';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { QuickViewModalComponent } from './components/partials/modal/quick-view-modal/quick-view-modal.component';
import { DeleteEnseignantModalComponent } from './components/partials/modal/delete-enseignant-modal/delete-enseignant-modal.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { MatTableModule } from '@angular/material/table'
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, ROOT_REDUCERS } from './ngrx/reducers';
import { AuthEffects, RouterEffects, AccountEffects } from './ngrx/effects';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserInterceptor, ErrorInterceptor } from './browser.interceptor';
import '@angular/common/locales/global/fr';
import { AuthService } from './ngrx/services/auth.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DefaultLayoutComponent } from './containers';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgPipesModule } from 'ngx-pipes';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';



import {
  AppAsideModule,
  // AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { AuthLoginComponent } from './auth/login/login.component';
import { AuthComponent } from './auth';
import { ProfileComponent } from './components/profile/profile.component';
import { UeComponent } from './components/ues/ues.component';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    AuthLoginComponent,
    AuthComponent,
    MenuComponent,
    NotFoundComponent,
    QuickViewModalComponent,
    DeleteEnseignantModalComponent,
    ProfileComponent,
    UeComponent

  ],
  imports: [
    MatSelectModule,
    BsDropdownModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatBadgeModule,
    NgxMatMomentModule,
    PerfectScrollbarModule,
    NgPipesModule,
    ProgressbarModule,
    TabsModule.forRoot(),
    NgxSpinnerModule,
    AppAsideModule,
    // AppBreadcrumbModule,
    AppHeaderModule,
    ModalModule.forRoot(),
    AppFooterModule,
    AppSidebarModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule.withServerTransition({ appId: 'projet' }),
    BrowserTransferStateModule,
    ReactiveFormsModule,
    MatTableModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressAnimation: 'increasing',
      includeTitleDuplicates: true,
      enableHtml: true
    }),
    ToastContainerModule,
    StoreDevtoolsModule.instrument({
      name: 'Build Analytics',
      maxAge: 7,
      logOnly: environment.production
    }),
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        // strictStateImmutability and strictActionImmutability are enabled by default
        strictStateSerializability: false,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
      }
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([AuthEffects, AccountEffects, RouterEffects]),
    NxModule.forRoot(),
  ],
  providers: [
    BsModalRef,
    AuthService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: BrowserInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
