import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { PoolsPage } from './pools.page';
import {PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider} from "../../services/mocks";
import {IonicModule} from "@ionic/angular";

describe('PoolsPage', () => {
  let component: PoolsPage;
  let fixture: ComponentFixture<PoolsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider, SolanaHelpersServiceMockProvider],
      imports: [IonicModule.forRoot(), PoolsPage]
    }).compileComponents();

    fixture = TestBed.createComponent(PoolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
