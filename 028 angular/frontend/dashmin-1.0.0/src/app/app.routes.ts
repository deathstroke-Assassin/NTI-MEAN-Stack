import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

/**
 * The layout is the parent route: it renders the sidebar + navbar once and
 * stays mounted while the child components are swapped through its
 * <router-outlet />. Child components are lazy loaded, so the sidebar is
 * always painted before the page content of a route arrives.
 */
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        title: 'Home | Dashmin',
        loadComponent: () => import('./components/home/home').then((m) => m.Home),
      },
      {
        path: 'about',
        title: 'About | Dashmin',
        loadComponent: () => import('./components/about/about').then((m) => m.About),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
