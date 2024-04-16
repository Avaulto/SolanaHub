import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LiquidityPoolsPage } from './liquidity-pools.page';
import {IonicModule} from "@ionic/angular";

describe('LiquidityPoolsPage', () => {
  let component: LiquidityPoolsPage;
  let fixture: ComponentFixture<LiquidityPoolsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LiquidityPoolsPage]
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidityPoolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
