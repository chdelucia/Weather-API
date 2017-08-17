import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }       from './web/components/home/home.component';
import {PageNotFoundComponent} from './web/components/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent}  
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);