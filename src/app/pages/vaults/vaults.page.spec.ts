import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaultsPage } from './vaults.page';

describe('VaultsPage', () => {
  let component: VaultsPage;
  let fixture: ComponentFixture<VaultsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VaultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
