import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaoPage } from './dao.page';

describe('DaoPage', () => {
  let component: DaoPage;
  let fixture: ComponentFixture<DaoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
