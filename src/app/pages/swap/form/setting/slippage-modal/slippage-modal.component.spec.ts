import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import { SlippageModalComponent } from './slippage-modal.component';
import {of} from "rxjs";
import {sign} from "chart.js/helpers";

describe('SlippageModalComponent', () => {
  let component: SlippageModalComponent;
  let fixture: ComponentFixture<SlippageModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: PopoverController, useValue: { dismiss: () => jest.fn()}}],
      imports: [SlippageModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SlippageModalComponent);
    component = fixture.componentInstance;
    component.selectedSlippage = 0;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
