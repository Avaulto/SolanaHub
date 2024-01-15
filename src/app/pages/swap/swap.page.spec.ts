import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwapPage } from './SwapPage';

describe('SwapPage', () => {
  let component: SwapPage;
  let fixture: ComponentFixture<SwapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SwapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
