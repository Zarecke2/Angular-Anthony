import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { StoreFacade } from 'src/app/ngrx/store.facade';
import { INavData } from '@coreui/angular';
import { User } from 'libs/models/users';
import { isNull, pick, isEmpty, extend, pluck, isUndefined, intersection, union } from 'underscore';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../ngrx/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

declare var $: any;
declare var moment: any;

@UntilDestroy()
@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnDestroy, AfterViewInit, OnInit {
    @ViewChild('appAside') child: any;
    @ViewChild('search', { static: false })
    set input(element: ElementRef<HTMLInputElement>) {
        if (element) {
            element.nativeElement.focus()
        }
    }
    public rc: string = '';
    public showAsideBar: any = false;
    public sidebarMinimized = false;
    //public navItems = navItems;
    public _is_assigned: any[] = [];
    public profile: User = null;
    public environment = environment;
    public timer: number = 500;
    public isLoading: Boolean = false;
    private bsModalSub: Subscription;
    public nav1: INavData[];


    public styles: Partial<CSSStyleDeclaration> = {
        background: 'transparent',
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: '8rem'
    };

    public timeLeft = 240;
    public navItems: INavData[] = [
        {
            name: 'ACCUEIL',
            url: '/menu',
            icon: 'icon-home'
        },
        {
            title: true,
            name: 'MENU'
        }
    ];

    constructor(
        public facade: StoreFacade, private router: Router,
        private authService: AuthService, private toast: ToastrService) {
        // this.isLoading = this.ws.isLoading;

        // this.chat?.messages?.pipe(takeWhile(() => authService?.loggedIn(), true));

        this.router.events.pipe(untilDestroyed(this)).subscribe((evt) => {
            if (this.authService?.loggedIn()) {

            }

        });

    }


    public nav_meta_interne: INavData[] = [
        {
            name: 'ACCUEIL',
            url: '/menu',
            icon: 'icon-home'
        },
        {
            title: true,
            name: 'MENU'
        },
        // {
        //     name: 'OPERATIONS',
        //     url: '/menu',
        //     icon: 'fas fa-cogs text-primary',
        //     children: [
        //         {
        //             name: 'Planning capacitaire',
        //             url: '/operations/scheduler',
        //             icon: 'fas fa-calendar-alt fa-xs'
        //         },
        //         {
        //             name: 'Planning activités',
        //             url: '/operations/calendar',
        //             icon: 'fas fa-clock fa-xs',
        //             badge: {
        //                 variant: 'danger',
        //                 text: 'OP'
        //             }
        //         },
        //         {
        //             name: 'Déploiements',
        //             url: '/operations/deploiements',
        //             icon: 'fas fa-project-diagram fa-xs',
        //             badge: {
        //                 variant: 'info',
        //                 text: 'RFC'
        //             }
        //         },
        //         {
        //             name: 'Demandes travaux',
        //             url: '/operations/standards',
        //             icon: 'fas fa-project-diagram fa-xs',
        //             badge: {
        //                 variant: 'warning',
        //                 text: 'DT'
        //             }
        //         },
        //         {
        //             name: 'Capa Search',
        //             url: '/operations/capasearch',
        //             icon: 'fas fa-cloud-rain text-light',
        //             badge: {
        //                 variant: 'light',
        //                 text: 'New'
        //             }
        //         }
        //     ]
        // }

    ];



    ngOnInit() {

        this.facade.account$.pipe(untilDestroyed(this)).subscribe((account) => {
            this.profile = account.profile;
        });


        this.getNav();

    }

    ngAfterViewInit() {
        const ls = document.getElementsByClassName('navbar-toggler');
        for (let index = 0; index < ls.length; index++) {
            ls[index]?.setAttribute('tabindex', '-1');
        }
    }

    catColor(cat) {

    }


    toggleMinimize(e) {
        this.sidebarMinimized = e;
    }

    getNav() {
        // if (this.profile?.role?.includes('Admin')) {
        //     let navItem: INavData[] = [];
        //     if (this.profile?._scope === 'DEA') {
        //         navItem = this.adminDEA;
        //     } else {
        //         navItem = this.adminSNCFR;
        //     }

        //     this.navItems = navItem;
        // } else {
        //     if (this.profile._scope === 'SNCFR') {
        //         if (this.profile?._teams?.length === 1 && this.profile?._teams.includes("6053578ec097c2d5afba8298")) { // CDPI
        //             this.navItems = this.nav_CDPI_interne;
        //         } else if (this.profile?._teams?.length === 1 && this.profile?._teams.includes('6155d7a9b9bd9b25fa672252')) { // DEVOPS
        //             this.navItems = this.nav_DEVOPS_interne;
        //         } else if (this.profile?._teams?.length === 1 && this.profile?._teams.includes('6220492e335c69acf91a49c5')) { // GOUV SNCFR
        //             this.navItems = this.nav_GOUVSNCFR;
        //         } else if (this.profile?._entities?.includes('DEX')) {
        //             if (this.profile?._client_id) {
        //                 const navItem: INavData[] = this.nav_dex_client;
        //                 this.navItems = navItem;
        //             } else {
        //                 this.navItems = this.nav_dex_interne;
        //             }
        //         } else {
        //             if (this.profile?._client_id) {
        //                 this.navItems = this.nav_meta_client;
        //             } else {
        //                 this.navItems = this.nav_meta_interne;
        //             }
        //         }
        //     } else { //DEA
        //         if (this.profile?._client_id) {
        //             this.navItems = this.nav_dea_client;
        //         } else {
        //             let navItem: INavData[] = this.nav_dea_interne;
        //             if (this.profile._role !== 'User') {
        //                 if (!(this.profile?._entities?.length && this.profile?._entities.length < 2 && this.profile?._entities?.includes('ERP'))) {
        //                     navItem = navItem.map(n => {
        //                         if (n.name === 'REPORTING') {
        //                             return extend({}, n, {
        //                                 children: n.children.concat({
        //                                     name: 'Mes imputations',
        //                                     url: '/reporting/cra',
        //                                     icon: 'fas fa-calculator fa-xs',
        //                                     badge: {
        //                                         variant: 'success',
        //                                         text: 'New'
        //                                     }
        //                                 })
        //                             });
        //                         } else {
        //                             return n;
        //                         }
        //                     });
        //                 }

        //                 navItem.push({
        //                     name: 'Centre de service',
        //                     url: '/account/gestion-centre-service',
        //                     icon: 'icon-cloud-download',
        //                     class: 'mt-auto',
        //                     variant: 'primary'
        //                 });
        //             } else {
        //                 if (!(this.profile?._entities?.length && this.profile?._entities.length < 2 && this.profile?._entities?.includes('ERP')) &&
        //                     intersection(pluck(this.teams.filter(t => this.profile?._teams?.includes(t._id)), 'family'), ['DSM TRANSI', 'DSM SA SNCF', 'DSM GARE & CO / DGNUM / FRET', 'DSM PF & PR', 'DSM VOYAGES TER'])
        //                 ) {
        //                     navItem = navItem.map(n => {
        //                         if (n.name === 'REPORTING') {
        //                             return extend({}, n, {
        //                                 children: n.children.concat({
        //                                     name: 'Mes imputations',
        //                                     url: '/reporting/cra',
        //                                     icon: 'fas fa-calculator fa-xs',
        //                                     badge: {
        //                                         variant: 'success',
        //                                         text: 'New'
        //                                     }
        //                                 })
        //                             });
        //                         } else {
        //                             return n;
        //                         }
        //                     });
        //                 }
        //             }
        //             this.navItems = navItem;
        //         }
        //     }
        // }

    }

    // changenavbar() {
    //     if (this.navItems === this.adminDEA || this.navItems === this.adminSNCFR) {
    //         this.navItems = this.nav2;
    //     } else {
    //         if (this.profile?._scope === 'DEA') {
    //             this.navItems = this.adminDEA;
    //         } else {
    //             this.navItems = this.adminSNCFR;
    //         }
    //     }
    // }

    ngOnDestroy() {
        this.bsModalSub?.unsubscribe();
    }

}
