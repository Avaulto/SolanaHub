import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from "@ionic/angular";

import { LendingPage } from './lending.page';

describe('LendingPage', () => {
  let component: LendingPage;
  let fixture: ComponentFixture<LendingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LendingPage]
    }).compileComponents();

    fixture = TestBed.createComponent(LendingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
