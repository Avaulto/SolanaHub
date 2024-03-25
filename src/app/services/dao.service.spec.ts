import { TestBed } from '@angular/core/testing';

import { DaoService } from './dao.service';

describe('DaoService', () => {
  let service: DaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
