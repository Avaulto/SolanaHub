import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavingPage } from './saving.page';

describe('SavingPage', () => {
  let component: SavingPage;
  let fixture: ComponentFixture<SavingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SavingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
