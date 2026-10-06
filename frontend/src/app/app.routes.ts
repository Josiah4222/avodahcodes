import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'work',
    loadComponent: () =>
      import('./work/work.component').then(m => m.WorkComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./services/services.component').then(m => m.ServicesComponent),
  },
  {
    path: 'studio',
    loadComponent: () =>
      import('./studio/studio.component').then(m => m.StudioComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
