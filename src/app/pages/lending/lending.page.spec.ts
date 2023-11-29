import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LendingPage } from './lending.page';

describe('LendingPage', () => {
  let component: LendingPage;
  let fixture: ComponentFixture<LendingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LendingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
