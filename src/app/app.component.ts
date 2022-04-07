import { Component, OnInit, Inject, PLATFORM_ID, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import moment from 'moment-business-days';
import { pluck } from 'underscore';
import { NgxSpinnerService } from 'ngx-spinner';
import { StoreFacade } from './ngrx/store.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from 'src/environments/environment';


const OffHolidays = [
  { day: '*-01-01', title: 'Jour de l\'an' },
  { day: '*-12-25', title: 'Noêl' },
  { day: '*-11-11', title: 'Armistice 1918' },
  { day: '*-11-01', title: 'Toussaint' },
  { day: '*-08-15', title: 'Assomption' },
  { day: '*-07-14', title: 'Fête nationale' },
  { day: '*-05-08', title: 'Victoire 1945' },
  { day: '*-05-01', title: 'Fête du travail' },
  { day: '2017-06-05', title: 'Lundi de pentecôte' }, { day: '2018-05-21', title: 'Lundi de pentecôte' }, { day: '2019-06-10', title: 'Lundi de pentecôte' }, { day: '2020-06-01', title: 'Lundi de pentecôte' }, { day: '2021-05-24', title: 'Lundi de pentecôte' }, { day: '2022-06-06', title: 'Lundi de pentecôte' }, { day: '2023-05-29', title: 'Lundi de pentecôte' }, { day: '2024-05-20', title: 'Lundi de pentecôte' },
  { day: '2017-05-25', title: 'Ascension' }, { day: '2018-05-10', title: 'Ascension' }, { day: '2019-05-30', title: 'Ascension' }, { day: '2020-05-21', title: 'Ascension' }, { day: '2021-05-13', title: 'Ascension' }, { day: '2022-05-26', title: 'Ascension' }, { day: '2023-05-18', title: 'Ascension' }, { day: '2024-05-09', title: 'Ascension' }, // Ascension
  { day: '2017-04-17', title: 'Lundi de pâques' }, { day: '2018-04-02', title: 'Lundi de pâques' }, { day: '2019-04-22', title: 'Lundi de pâques' }, { day: '2020-04-13', title: 'Lundi de pâques' }, { day: '2021-04-05', title: 'Lundi de pâques' }, { day: '2022-04-18', title: 'Lundi de pâques' }, { day: '2023-04-10', title: 'Lundi de pâques' }, { day: '2024-04-01', title: 'Lundi de pâques' }
];

@UntilDestroy()
@Component({
  selector: 'app-root',
  template: `
  <div toastContainer></div>
  <ngx-spinner name="mainSpinner" bdColor="rgba(232,232,232,1)" size="large"
  color="#4682B4" type="ball-clip-rotate-pulse">
  <p style="color: #4682B4;">Chargement des données...</p>
  </ngx-spinner>
  <ngx-spinner name="searchSpinner" bdColor="rgba(0,0,0,0)" size="large"
  color="#0099cc" type="square-jelly-box" [fullScreen]="true">
  <p style="color: #0099cc; font-size:larger; font-weight: bold"> Recherche en cours... </p>
  </ngx-spinner>
  <router-outlet></router-outlet>
  `
})

export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private facade: StoreFacade,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      moment.updateLocale('fr', {
        timezone: 'Europe/Paris',
        holidays: pluck(OffHolidays, 'day'),
        holidayFormat: 'YYYY-MM-DD',
        workinghours: {
          0: null,
          1: ['08:00:00', '19:00:00'],
          2: ['08:00:00', '19:00:00'],
          3: ['08:00:00', '19:00:00'],
          4: ['08:00:00', '19:00:00'],
          5: ['08:00:00', '19:00:00'],
          6: null
        }
      });
    }
  }

  ngOnInit() {

    this.router.events.pipe(untilDestroyed(this)).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }


}
