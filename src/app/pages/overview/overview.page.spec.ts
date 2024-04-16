import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { OverviewPage } from './overview.page';
import {
  JupStoreServiceMockProvider,
  PortfolioServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../services/mocks";
import {IonicModule} from "@ionic/angular";

describe('OverviewPage', () => {
  let component: OverviewPage;
  let fixture: ComponentFixture<OverviewPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider, JupStoreServiceMockProvider],
      imports: [IonicModule.forRoot(), OverviewPage]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
