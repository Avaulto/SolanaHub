import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { MemberStatsComponent } from './member-stats.component';

describe('MemberStatsComponent', () => {
  let component: MemberStatsComponent;
  let fixture: ComponentFixture<MemberStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MemberStatsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberStatsComponent);
    component = fixture.componentInstance;
    component.loyalMember = {};
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
