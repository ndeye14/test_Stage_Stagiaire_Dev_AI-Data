import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
  MatHeaderCell,
  MatCell,
  MatHeaderRow,
  MatRow,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { DataSharingService } from '../../services/data-sharing.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'product_name',
    'price',
    'quantity',
    'category',
    'total',
  ];
  dataSource = new MatTableDataSource<any>();

  donneesNettoyees: any[] = [];
  anomalies: any[] = [];
  constructor(private dataSharingService: DataSharingService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.dataSharingService.currentData.subscribe(
      (value: { data: any[]; anomalies: any[]; donneesNettoyees: any[] }) => {
        this.dataSource.data = value.data;
        this.anomalies = value.anomalies;
        // Filtrer les données pour n'afficher que celles sans anomalies
        const anomalyIndexes = new Set(
          this.anomalies.map((anomaly) => anomaly.index)
        );
        this.donneesNettoyees = this.dataSource.data.filter(
          (row, index) => !anomalyIndexes.has(index)
        );
        // Mettre à jour la source de données avec les données nettoyées
        this.dataSource.data = this.donneesNettoyees;
        // Assignez le tri et la pagination ici, une fois que les données sont disponibles
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
    // console.log('Données de la table:', this.dataSource.data);
    // console.log('Anomalies:', this.anomalies);
    // console.log('Données nettoyées:', this.donneesNettoyees);
  }

  exportToCSV() {
    if (this.dataSource.data.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }

    // Étape 1 : Créer un ensemble d'index d'anomalies pour un filtrage efficace
    const anomalyIndexes = new Set(
      this.anomalies.map((anomaly) => anomaly.index)
    );

    // Étape 2 : Filtrer les données pour exclure les lignes avec des anomalies
    const cleanedData = this.dataSource.data.filter(
      (row, index) => !anomalyIndexes.has(index)
    );

    // Vérifier s'il reste des données après le nettoyage
    if (cleanedData.length === 0) {
      alert(
        'Toutes les données contenaient des anomalies. Aucun fichier à exporter.'
      );
      return;
    }

    // Étape 3 : Créer le fichier CSV à partir des données filtrées
    const headers = Object.keys(cleanedData[0]).join(',');
    const rows = cleanedData.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Étape 4 : Déclencher le téléchargement du fichier
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'donnees_nettoyees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ngAfterViewInit() {
    this.dataSource.data = this.donneesNettoyees;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
