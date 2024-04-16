import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { PriceDataComponent } from './price-data.component';
import {PriceHistoryServiceMockProvider} from "../../../../../services/mocks";
import { Token } from 'src/app/models';

describe('PriceDataComponent', () => {
  let component: PriceDataComponent;
  let fixture: ComponentFixture<PriceDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PriceHistoryServiceMockProvider],
      imports: [IonicModule.forRoot(), PriceDataComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceDataComponent);
    component = fixture.componentInstance;
    component.token = {} as Token;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
