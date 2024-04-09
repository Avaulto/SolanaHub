import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirdropFinderPage } from './airdrop-finder.page';

describe('AirdropFinderPage', () => {
  let component: AirdropFinderPage;
  let fixture: ComponentFixture<AirdropFinderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AirdropFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
