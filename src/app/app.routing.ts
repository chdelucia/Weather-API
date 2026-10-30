import { Routes } from '@angular/router';
import { HomeComponent } from './web/components/home/home.component';
import { PageNotFoundComponent } from './web/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];
