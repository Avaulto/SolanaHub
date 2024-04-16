import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositionsComponent } from './positions.component';
import {
  JupStoreServiceMockProvider,
  LiquidStakeServiceMockProvider,
  PortfolioServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../../services/mocks";

describe('PositionsComponent', () => {
  let component: PositionsComponent;
  let fixture: ComponentFixture<PositionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LiquidStakeServiceMockProvider, PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider, JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), PositionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
