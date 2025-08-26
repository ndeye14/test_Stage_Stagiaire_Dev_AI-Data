import { TestBed } from '@angular/core/testing';

import { AnomalyDetectorService } from './anomaly-detector.service';

describe('AnomalyDetectorService', () => {
  let service: AnomalyDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnomalyDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
