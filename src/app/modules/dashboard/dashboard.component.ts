import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DataSharingService } from '../../services/data-sharing.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    BaseChartDirective, // Importez la directive du graphique
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  data: any[] = [];
  anomalies: any[] = [];

  constructor(private dataSharingService: DataSharingService) {}

  public anomalyChartType: ChartType = 'bar'; // Type de graphique barre
  public anomalyChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: "Nombre d'anomalies" }],
  };
  public anomalyChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnInit(): void {
    this.dataSharingService.currentData.subscribe((data) => {
      this.data = data.data; // Le composant reçoit les données du service
      this.anomalies = data.anomalies;
      console.log('Anomalies détectées:', this.anomalies);
      console.log('Données de la table:', this.data);
      this.processAnomaliesForChart();
    });
  }

  processAnomaliesForChart() {
    const anomalyCounts: { [key: string]: number } = {};
    this.anomalies.forEach((anomaly) => {
      anomalyCounts[anomaly.reason] = (anomalyCounts[anomaly.reason] || 0) + 1;
    });

    this.anomalyChartData.labels = Object.keys(anomalyCounts);
    this.anomalyChartData.datasets[0].data = Object.values(anomalyCounts);
  }

  // code pour le chiffre d'affaires
  get revenue(): number {
    return this.data.reduce((sum, row) => {
      const price = parseFloat(row.price) || 0;
      const quantity = parseInt(row.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  }

  get orders(): number {
    return this.data.length;
  }
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Ventes', data: [], borderColor: 'blue' }],
  };

  chartOptions: ChartOptions = {
    responsive: true,
  };

  get anomalyRate(): number {
    if (this.data.length === 0) {
      return 0; // Éviter la division par zéro
    }
    return (this.anomalies.length / this.data.length) * 100;
  }
  ngOnChanges() {
    if (this.data.length) {
      const salesByDate: { [key: string]: number } = {};
      this.data.forEach((row) => {
        const date = row.date || 'Inconnu';
        salesByDate[date] =
          (salesByDate[date] || 0) +
          parseFloat(row.price) * parseInt(row.quantity);
      });
      this.chartData.labels = Object.keys(salesByDate);
      this.chartData.datasets[0].data = Object.values(salesByDate);
    }
  }
}
