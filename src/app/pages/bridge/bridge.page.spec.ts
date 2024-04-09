import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BridgePage } from './bridge.page';

describe('BridgePage', () => {
  let component: BridgePage;
  let fixture: ComponentFixture<BridgePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BridgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
