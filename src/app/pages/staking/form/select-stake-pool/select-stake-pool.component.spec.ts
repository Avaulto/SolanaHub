import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectStakePoolComponent } from './select-stake-pool.component';
import {StakePool} from "../../../../models";
import {signal} from "@angular/core";

describe('SelectStakePoolComponent', () => {
  let component: SelectStakePoolComponent;
  let fixture: ComponentFixture<SelectStakePoolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectStakePoolComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectStakePoolComponent);
    component = fixture.componentInstance;

    component.stakePools = signal([] as StakePool[]);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
