import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouteCalcComponent } from './route-calc.component';
import {UtilService} from "../../../services";
import {JupRoute} from "../../../models";
import {UtilServiceMockProvider} from "../../../services/mocks";

describe('RouteCalcComponent', () => {
  let component: RouteCalcComponent;
  let fixture: ComponentFixture<RouteCalcComponent>;
  let utilService: UtilService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UtilServiceMockProvider],
      imports: [IonicModule.forRoot(), RouteCalcComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteCalcComponent);
    component = fixture.componentInstance;
    utilService = TestBed.inject(UtilService);
    component.routeInfo = {} as JupRoute;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
