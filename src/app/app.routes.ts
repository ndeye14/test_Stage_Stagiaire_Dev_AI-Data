import { Routes } from '@angular/router';
import { UploadComponent } from './modules/upload/upload.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { TableComponent } from './modules/table/table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'table', component: TableComponent },
];
