import { TestBed } from '@angular/core/testing';

import { IsConnectedGuard } from './is-connected.guard';
import {WalletStore} from "@heavy-duty/wallet-adapter";

describe('IsConnectedGuard', () => {
  let guard: IsConnectedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WalletStore, useValue: jest.fn()}]
    });
    guard = TestBed.inject(IsConnectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
