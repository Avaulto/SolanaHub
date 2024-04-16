import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";
import {
  JupStoreServiceMockProvider,
  PortfolioServiceMockProvider,
  SolanaHelpersServiceMockProvider
} from "../../services/mocks";
import {SwapPage} from "./swap.page";
import {ActivatedRoute} from "@angular/router";

describe('SwapPage', () => {
  let component: SwapPage;
  let fixture: ComponentFixture<SwapPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider, JupStoreServiceMockProvider, {
        provide: ActivatedRoute,
        useValue: jest.fn()}],
      imports: [IonicModule.forRoot(), SwapPage]
    }).compileComponents();

    fixture = TestBed.createComponent(SwapPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
