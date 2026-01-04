import { Routes } from '@angular/router';
import { RideListComponent } from './components/ride-list/ride-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'rides', pathMatch: 'full' },
  { path: 'rides', component: RideListComponent },
  { path: '**', redirectTo: 'rides' }
];
