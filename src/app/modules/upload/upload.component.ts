import { ChangeDetectorRef, Component } from '@angular/core';
import { CsvParserService } from '../../services/csv-parser.service';
import { AnomalyDetectorService } from '../../services/anomaly-detector.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { DataSharingService } from '../../services/data-sharing.service';
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";



@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatTableModule,
    MatIconModule
],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  data: any[] = [];
  anomalies: any[] = [];

  constructor(
    private csv: CsvParserService,
    private detector: AnomalyDetectorService,
    private cdr: ChangeDetectorRef,
    private dataSharingService: DataSharingService
  ) {}



  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.data = await this.csv.parse(file);
      this.anomalies = this.detector.detect(this.data);
      this.cdr.detectChanges();
      this.dataSharingService.updateData(this.data, this.anomalies, []);
      console.log(this.anomalies);
      console.log(this.data);
    }
  }






}
