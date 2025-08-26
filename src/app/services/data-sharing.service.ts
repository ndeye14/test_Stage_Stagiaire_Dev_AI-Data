// data-sharing.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private dataSource = new BehaviorSubject<{ data: any[]; anomalies: any[]; donneesNettoyees: any[] }>({
    data: [],
    anomalies: [],
    donneesNettoyees: [],
  });

  public currentData = this.dataSource.asObservable();



  constructor() {}

  updateData(data: any[], anomalies: any[], donneesNettoyees: any[]) {
    this.dataSource.next({ data, anomalies, donneesNettoyees });
  }
}
