import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidityPoolsPage } from './liquidity-pools.page';

describe('LiquidityPoolsPage', () => {
  let component: LiquidityPoolsPage;
  let fixture: ComponentFixture<LiquidityPoolsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LiquidityPoolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
