import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssetModalComponent } from './asset-modal.component';
import {
  JupStoreServiceMockProvider,
  PortfolioServiceMockProvider,
  PriceHistoryServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../../../services/mocks";
import { Token } from 'src/app/models';

describe('AssetModalComponent', () => {
  let component: AssetModalComponent;
  let fixture: ComponentFixture<AssetModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider, PriceHistoryServiceMockProvider, JupStoreServiceMockProvider],
      imports: [AssetModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetModalComponent);
    component = fixture.componentInstance;
    component.token = {} as Token;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
