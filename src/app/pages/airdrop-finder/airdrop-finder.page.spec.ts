import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";
import { AirdropFinderPage } from './airdrop-finder.page';
import {PortfolioServiceMockProvider} from "../../services/mocks/portfolio.service.mock";
import {SolanaHelpersServiceMockProvider} from "../../services/mocks/solana-helpers.service.mock";

describe('AirdropFinderPage', () => {
  let component: AirdropFinderPage;
  let fixture: ComponentFixture<AirdropFinderPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider],
      imports: [IonicModule.forRoot(), AirdropFinderPage]
    }).compileComponents();

    fixture = TestBed.createComponent(AirdropFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
