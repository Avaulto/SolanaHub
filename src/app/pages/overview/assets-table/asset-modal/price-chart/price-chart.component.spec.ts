import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { PriceChartComponent } from './price-chart.component';
import {PriceHistoryServiceMockProvider} from "../../../../../services/mocks";
import { Token } from 'src/app/models';

describe('PriceChartComponent', () => {
  let component: PriceChartComponent;
  let fixture: ComponentFixture<PriceChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PriceHistoryServiceMockProvider],
      imports: [IonicModule.forRoot(), PriceChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceChartComponent);
    component = fixture.componentInstance;
    jest.spyOn(component as any, "createGroupCategory").mockImplementation(() => {})
   component.token = {} as Token;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
