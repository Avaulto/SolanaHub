import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StakingPage } from './staking.page';

describe('StakingPage', () => {
  let component: StakingPage;
  let fixture: ComponentFixture<StakingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StakingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
