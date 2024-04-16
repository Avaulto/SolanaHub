import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotConnectedComponent } from './not-connected.component';
import {WalletStore} from "@heavy-duty/wallet-adapter";
import {LoyaltyLeagueServiceMockProvider, SolanaHelpersServiceMockProvider} from "../../../services/mocks";
import {of} from "rxjs";

describe('NotConnectedComponent', () => {
  let component: NotConnectedComponent;
  let fixture: ComponentFixture<NotConnectedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: WalletStore, useValue: { wallets$: of(), connected$: of(), publicKey$: of() } }, SolanaHelpersServiceMockProvider, LoyaltyLeagueServiceMockProvider],
      imports: [IonicModule.forRoot(), NotConnectedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotConnectedComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
