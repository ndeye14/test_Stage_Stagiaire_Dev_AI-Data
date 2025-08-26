import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

@Injectable({ providedIn: 'root' })
export class CsvParserService {
  parse(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result:any) => resolve(result.data as any[]),
        error: (error:any) => reject(error),
      });
    });
  }
}

