import { TestBed } from '@angular/core/testing';
import { ImgbbService } from './img.service';

describe('ImgbbService', () => {
  let service: ImgbbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgbbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
