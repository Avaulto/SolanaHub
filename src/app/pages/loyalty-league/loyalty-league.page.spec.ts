import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoyaltyLeaguePage } from './loyalty-league.page';

describe('LoyaltyLeaguePage', () => {
  let component: LoyaltyLeaguePage;
  let fixture: ComponentFixture<LoyaltyLeaguePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoyaltyLeaguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
