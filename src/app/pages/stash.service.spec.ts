import { TestBed } from '@angular/core/testing';

import { StashService } from './stash/stash.service';

describe('StashService', () => {
  let service: StashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
