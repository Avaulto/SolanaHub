import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PortfolioBreakdownComponent } from './portfolio-breakdown.component';
import {PortfolioServiceMockProvider} from "../../../services/mocks";

describe('PortfolioBreakdownComponent', () => {
  let component: PortfolioBreakdownComponent;
  let fixture: ComponentFixture<PortfolioBreakdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceMockProvider],
      imports: [IonicModule.forRoot(), PortfolioBreakdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioBreakdownComponent);
    component = fixture.componentInstance;
    jest.spyOn(component as any, "createGroupCategory").mockImplementation(() => {})
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
