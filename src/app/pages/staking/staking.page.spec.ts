import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { StakingPage } from './staking.page';
import {
  JupStoreServiceMockProvider, LiquidStakeServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../services/mocks";
import {IonicModule} from "@ionic/angular";
import {ApiServiceMockProvider} from "../../services/mocks";
import {of} from "rxjs";

describe('StakingPage', () => {
  let component: StakingPage;
  let fixture: ComponentFixture<StakingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SolanaHelpersServiceMockProvider, ApiServiceMockProvider, JupStoreServiceMockProvider, LiquidStakeServiceMockProvider],
      imports: [ StakingPage]
    }).compileComponents();

    fixture = TestBed.createComponent(StakingPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
