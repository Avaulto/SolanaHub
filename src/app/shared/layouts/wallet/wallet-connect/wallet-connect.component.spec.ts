import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { WalletConnectComponent } from './wallet-connect.component';
import {of} from "rxjs";
import {WalletStore} from "@heavy-duty/wallet-adapter";
import {
  LoyaltyLeagueServiceMockProvider,
  PortfolioServiceMockProvider,
  SolanaHelpersServiceMockProvider, UtilServiceMockProvider
} from "../../../../services/mocks";

xdescribe('WalletConnectComponent', () => {
  let component: WalletConnectComponent;
  let fixture: ComponentFixture<WalletConnectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SolanaHelpersServiceMockProvider, PortfolioServiceMockProvider, LoyaltyLeagueServiceMockProvider, UtilServiceMockProvider,
        { provide: WalletStore, useValue: jest.fn() },
        { provide: PopoverController, useValue: jest.fn() }
      ],
      declarations: [ WalletConnectComponent ],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConnectComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
